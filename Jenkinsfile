pipeline {  
  agent any

  options {
    buildDiscarder(logRotator(numToKeepStr: '30', artifactNumToKeepStr: '5'))
  }

  triggers {
    cron '@midnight'
  }

  stages {
    stage('Build') {
      steps {
        script {
          catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
            docker.build('node').inside {
              sh 'configs/switch-to-mirror-repo.sh'
              sh 'yarn build'
              sh 'configs/link-vscode-integration.sh'
              dir ('integration/vscode') {
                sh 'yarn build'
              }
              archiveArtifacts 'integration/eclipse/webview/app/*'
            }
          }
        }
      }
    }

    stage('Codechecks (ESLint)') {
      steps {
        script {
          catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
            docker.build('node').inside {
              timeout(30){
                sh "yarn lint -o eslint.xml -f checkstyle"
                dir ('integration/vscode') {
                  sh 'yarn lint -o eslint.xml -f checkstyle'
                }
              }
            }
          }
        }
      }
    }

    stage('Tests (Mocha)') {
      steps { 
        script {
          docker.build('node').inside {
            timeout(30) {
              sh "yarn test:ci"
            }
          }
        }
      }
    }

    stage('Deploy (master only)') {
      when {
        branch 'master'
      }
      steps { 
        script {
          docker.image('maven:3.6.3-jdk-11').inside {
            maven cmd: "-f integration/eclipse/webview clean deploy"
          }
          archiveArtifacts 'integration/eclipse/webview/target/glsp-client-*.zip'
        }
      }
    }
  }
  post {
    always {
      // Record & publish ESLint issues
      recordIssues enabledForFailure: true, publishAllIssues: true, aggregatingResults: true, 
      tools: [esLint(pattern: 'node_modules/**/*/eslint.xml')], 
      qualityGates: [[threshold: 1, type: 'TOTAL', unstable: true]]

      withChecks('Tests') {
        junit 'node_modules/**/report.xml'
      }
    }
  }
}
