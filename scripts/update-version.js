#!/usr/bin/env node

/**
 * Automatic versioning system
 * 
 * Major: Manual (set in current-version.json)
 * Minor: Number of deployments to production
 * Patch: Number of commits since last major version
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const versionFile = path.join(process.cwd(), 'data/versions/current-version.json')
const milestonesFile = path.join(process.cwd(), 'data/versions/milestones.json')
const deploymentsFile = path.join(process.cwd(), 'data/versions/deployments.json')

function executeGitCommand(command) {
  try {
    return execSync(command, { encoding: 'utf8', cwd: process.cwd(), stdio: 'pipe' }).trim()
  } catch (error) {
    return null
  }
}

function checkGitAvailable() {
  try {
    execSync('git --version', { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}

function checkGitRepository() {
  try {
    execSync('git rev-parse --git-dir', { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}

function getTotalCommits() {
  try {
    const count = executeGitCommand('git rev-list --count HEAD')
    return count ? parseInt(count, 10) : 0
  } catch {
    return 0
  }
}

function getCurrentCommit() {
  try {
    return executeGitCommand('git rev-parse HEAD')
  } catch {
    return null
  }
}

function getCommitsSinceDate(date) {
  if (!date) return 0
  try {
    const count = executeGitCommand(`git rev-list --count --since="${date}" HEAD`)
    return count ? parseInt(count, 10) : 0
  } catch {
    return 0
  }
}

function isProductionDeployment() {
  // Check if this is a production deployment
  // Methods to detect:
  // 1. Check for deployment tag
  // 2. Check CI/CD environment variables
  // 3. Check for deployment marker file
  
  // Method 1: Check for deployment tag
  // Get deployment tag - cross-platform approach
  let deploymentTag = null
  try {
    const tag = executeGitCommand('git describe --tags --exact-match HEAD')
    if (tag) {
      deploymentTag = tag
    }
  } catch {
    // Not on a tag, that's okay
    deploymentTag = null
  }
  if (deploymentTag && deploymentTag.includes('deploy')) {
    return true
  }
  
  // Method 2: Check CI/CD environment (GitHub Actions, etc.)
  if (process.env.CI === 'true' && process.env.GITHUB_REF === 'refs/heads/master') {
    return true
  }
  
  // Method 3: Check for deployment marker file
  const deployMarker = path.join(process.cwd(), '.deploy-marker')
  if (fs.existsSync(deployMarker)) {
    const markerTime = fs.statSync(deployMarker).mtime
    const now = new Date()
    // If marker was created in last 5 minutes, consider it a deployment
    if (now - markerTime < 5 * 60 * 1000) {
      return true
    }
  }
  
  // Method 4: Check if --deploy flag is passed (explicit deployment marker)
  if (process.argv.includes('--deploy')) {
    return true
  }
  
  // Method 5: Check if running in build script (production build)
  if (process.env.NODE_ENV === 'production') {
    return true
  }
  
  return false
}

function loadCurrentVersion() {
  if (!fs.existsSync(versionFile)) {
    // Initialize with default version
    const defaultVersion = {
      major: 1,
      minor: 0,
      patch: 0,
      lastMajorUpdate: new Date().toISOString().split('T')[0],
      lastDeployment: null,
      lastDeploymentCommit: null,
      commitsSinceLastMajor: 0,
      deploymentsSinceLastMajor: 0
    }
    fs.writeFileSync(versionFile, JSON.stringify(defaultVersion, null, 2))
    return defaultVersion
  }
  
  try {
    const content = fs.readFileSync(versionFile, 'utf8')
    return JSON.parse(content)
  } catch (error) {
    console.error('Error reading version file:', error)
    return {
      major: 1,
      minor: 0,
      patch: 0,
      lastMajorUpdate: new Date().toISOString().split('T')[0],
      lastDeployment: null,
      lastDeploymentCommit: null,
      commitsSinceLastMajor: 0,
      deploymentsSinceLastMajor: 0
    }
  }
}

function saveVersion(version) {
  fs.writeFileSync(versionFile, JSON.stringify(version, null, 2))
}

function recordDeployment(version, commitHash) {
  // Load existing deployments
  let deployments = []
  if (fs.existsSync(deploymentsFile)) {
    try {
      const content = fs.readFileSync(deploymentsFile, 'utf8')
      const data = JSON.parse(content)
      deployments = Array.isArray(data.deployments) ? data.deployments : []
    } catch (error) {
      console.warn('⚠️  Error reading deployments.json, starting fresh')
      deployments = []
    }
  }
  
  // Get the previous deployment commit (before this one)
  // We need to look at the previous deployment in the list, or use lastDeploymentCommit
  const previousDeploymentCommit = deployments.length > 0 
    ? deployments[deployments.length - 1].commit 
    : (version.lastDeploymentCommit || null)
  const lastMajorDate = version.lastMajorUpdate
  
  // Get commits in this deployment
  let deployedCommits = []
  try {
    if (previousDeploymentCommit) {
      // Get commits since previous deployment (excluding the current commit which is the version bump)
      const logFormat = '%H|%h|%s|%an|%ai'
      const logCommand = `git log ${previousDeploymentCommit}..${commitHash} --pretty=format:"${logFormat}" --reverse`
      const logOutput = executeGitCommand(logCommand)
      
      if (logOutput) {
        const lines = logOutput.split('\n').filter(line => line.trim())
        deployedCommits = lines.map(line => {
          const parts = line.split('|')
          return {
            hash: parts[0] || '',
            shortHash: parts[1] || (parts[0] ? parts[0].substring(0, 7) : ''),
            message: parts[2] || '',
            author: parts[3] || '',
            date: parts[4] ? parts[4].split(' ')[0] : new Date().toISOString().split('T')[0]
          }
        }).filter(c => c.hash && !c.message.toLowerCase().includes('bump version'))
      }
    } else {
      // First deployment - get commits since last major (up to this commit)
      const logFormat = '%H|%h|%s|%an|%ai'
      const logCommand = `git log --since="${lastMajorDate}" ${commitHash} --pretty=format:"${logFormat}" --reverse`
      const logOutput = executeGitCommand(logCommand)
      
      if (logOutput) {
        const lines = logOutput.split('\n').filter(line => line.trim())
        deployedCommits = lines.map(line => {
          const parts = line.split('|')
          return {
            hash: parts[0] || '',
            shortHash: parts[1] || (parts[0] ? parts[0].substring(0, 7) : ''),
            message: parts[2] || '',
            author: parts[3] || '',
            date: parts[4] ? parts[4].split(' ')[0] : new Date().toISOString().split('T')[0]
          }
        }).filter(c => c.hash && !c.message.toLowerCase().includes('bump version'))
      }
    }
  } catch (error) {
    console.warn('⚠️  Error getting deployment commits:', error.message)
  }
  
  // Get deployment stats
  let stats = {}
  try {
    const statCommand = previousDeploymentCommit 
      ? `git diff --stat ${previousDeploymentCommit} ${commitHash}`
      : `git diff --stat --since="${lastMajorDate}" ${commitHash}`
    const statOutput = executeGitCommand(statCommand)
    if (statOutput) {
      const lines = statOutput.split('\n').filter(line => line.trim())
      const lastLine = lines[lines.length - 1]
      if (lastLine) {
        const match = lastLine.match(/(\d+)\s+files?\s+changed(?:,\s+(\d+)\s+insertions?)?(?:,\s+(\d+)\s+deletions?)?/)
        if (match) {
          stats = {
            filesChanged: parseInt(match[1] || '0', 10),
            additions: parseInt(match[2] || '0', 10),
            deletions: parseInt(match[3] || '0', 10)
          }
        }
      }
    }
  } catch (error) {
    // Ignore stats errors
  }
  
  // Create deployment record
  const deployment = {
    version: `${version.major}.${version.minor}.${version.patch}`,
    date: new Date().toISOString().split('T')[0],
    commit: commitHash,
    shortCommit: commitHash.substring(0, 7),
    commits: deployedCommits,
    summary: deployedCommits.length > 0 
      ? `${deployedCommits.length} commit${deployedCommits.length !== 1 ? 's' : ''} deployed`
      : 'Deployment',
    changes: stats
  }
  
  // Add to deployments array
  deployments.push(deployment)
  
  // Save deployments
  try {
    fs.writeFileSync(deploymentsFile, JSON.stringify({ deployments }, null, 2))
    console.log(`📝 Deployment recorded: v${deployment.version} (${deployment.commits.length} commits)`)
  } catch (error) {
    console.error('❌ Error saving deployments.json:', error.message)
  }
}

function updateMilestone(version) {
  // Only create milestones for major releases (x.0.0)
  // Milestones should represent significant achievements, not every version update
  // Regular deployments are tracked separately in deployments.json
  const versionString = `${version.major}.${version.minor}.${version.patch}`
  const today = new Date().toISOString().split('T')[0]
  
  // Only create milestone for major releases
  if (version.minor !== 0 || version.patch !== 0) {
    // Not a major release - don't create milestone
    return
  }
  
  // Load existing milestones
  let milestones = []
  if (fs.existsSync(milestonesFile)) {
    try {
      const content = fs.readFileSync(milestonesFile, 'utf8')
      const data = JSON.parse(content)
      milestones = Array.isArray(data.milestones) ? data.milestones : []
    } catch (error) {
      console.warn('Error reading milestones file:', error)
    }
  }
  
  // Check if this version already exists
  const existingIndex = milestones.findIndex(m => m.version === versionString)
  
  // Major release milestone
  const milestone = {
    version: versionString,
    date: today,
    title: `Version ${version.major}.0.0 Release`,
    description: `Major version ${version.major} release`,
    autoGenerated: true,
    stats: {
      commits: version.commitsSinceLastMajor,
      deployments: version.deploymentsSinceLastMajor
    }
  }
  
  if (existingIndex >= 0) {
    // Update existing milestone only if it's auto-generated
    const existing = milestones[existingIndex]
    if (existing.autoGenerated !== false) {
      milestones[existingIndex] = { ...existing, ...milestone }
    }
  } else {
    // Add new milestone
    milestones.push(milestone)
    // Sort by version (newest first)
    milestones.sort((a, b) => {
      const aParts = a.version.split('.').map(Number)
      const bParts = b.version.split('.').map(Number)
      for (let i = 0; i < 3; i++) {
        if (bParts[i] !== aParts[i]) return bParts[i] - aParts[i]
      }
      return 0
    })
  }
  
  // Save milestones
  fs.writeFileSync(milestonesFile, JSON.stringify({ milestones }, null, 2))
}

function main() {
  console.log('🔄 Updating version...\n')
  
  if (!checkGitAvailable() || !checkGitRepository()) {
    console.warn('⚠️  Git not available or not in a git repository. Skipping version update.')
    return
  }
  
  const currentVersion = loadCurrentVersion()
  const currentCommit = getCurrentCommit()
  const isDeployment = isProductionDeployment()
  
  // Calculate commits since last major version
  const commitsSinceMajor = getCommitsSinceDate(currentVersion.lastMajorUpdate)
  currentVersion.commitsSinceLastMajor = commitsSinceMajor
  
  // Check if this is a new deployment
  // If --deploy flag is passed, always treat as new deployment
  const forceDeployment = process.argv.includes('--deploy')
  const isNewDeployment = isDeployment && (
    forceDeployment || 
    currentCommit !== currentVersion.lastDeploymentCommit
  )
  
  // Update version
  let versionChanged = false
  
  if (isNewDeployment) {
    // Increment minor version (deployment)
    currentVersion.minor += 1
    currentVersion.deploymentsSinceLastMajor += 1
    currentVersion.lastDeployment = new Date().toISOString().split('T')[0]
    currentVersion.lastDeploymentCommit = currentCommit
    versionChanged = true
    console.log('🚀 Production deployment detected - incrementing minor version')
    
    // Create deployment marker file for future detection
    const deployMarker = path.join(process.cwd(), '.deploy-marker')
    fs.writeFileSync(deployMarker, JSON.stringify({
      timestamp: new Date().toISOString(),
      commit: currentCommit,
      version: `${currentVersion.major}.${currentVersion.minor}.${currentVersion.patch}`
    }, null, 2))
  }
  
  // Update patch version (commits)
  currentVersion.patch = commitsSinceMajor
  if (currentVersion.patch !== commitsSinceMajor) {
    versionChanged = true
  }
  
  // Save version
  saveVersion(currentVersion)
  
  const versionString = `${currentVersion.major}.${currentVersion.minor}.${currentVersion.patch}`
  console.log(`✅ Current version: ${versionString}`)
  console.log(`   - Major: ${currentVersion.major} (manual)`)
  console.log(`   - Minor: ${currentVersion.minor} (${currentVersion.deploymentsSinceLastMajor} deployments)`)
  console.log(`   - Patch: ${currentVersion.patch} (${commitsSinceMajor} commits)`)
  
  // Record deployment if this is a new deployment
  if (isNewDeployment) {
    recordDeployment(currentVersion, currentCommit)
    console.log(`📝 Deployment recorded for version ${versionString}`)
  }
  
  // Only update milestone for major releases or significant deployments
  // Don't create milestones for every version update - that creates noise
  // Milestones should be manually created or only for major releases
  if (versionChanged && currentVersion.patch === 0 && currentVersion.minor === 0) {
    // Only create milestone for major releases (x.0.0)
    updateMilestone(currentVersion)
    console.log(`📝 Milestone created for major version ${versionString}`)
  }
  
  console.log('\n✅ Version update complete!')
}

main()
