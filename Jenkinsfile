pipeline {
   agent any
   stages {
       stage('start') {
           steps {
               git branch: "jenkins-test"
               url: "https://github.com/xijianhao/ddAttendance"
               echo "branch_name: ${BUILD_URL}"
           }
       }
       stage('next') {
           steps {
                sleep 10
                echo '构建完成'
           }
       }
       stage('end') {
           steps {
                sleep 10
                echo "number: ${currentBuild.number}"
           }
       }
   }
}