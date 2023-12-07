pipeline {
   agent any
   stages {
       stage('github-pull') {
           steps {
               git branch: "jenkins-test",
               url: "https://github.com/xijianhao/ddAttendance"
               echo $BRANCH_NAME 
           }
       }
       stage('next') {
           steps {
                sleep 10,
                echo '构建完成'
           }
       }
   }
}