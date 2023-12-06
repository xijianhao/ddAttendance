pipeline {
   agent any
   stages {
       stage('github-pull') {
           steps {
               git branch: "jenkins-test",
               url: "https://github.com/xijianhao/ddAttendance"
           }
       }
   }
}