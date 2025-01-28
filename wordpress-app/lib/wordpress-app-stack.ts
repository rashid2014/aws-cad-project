import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as lb from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { AutoScalingGroup } from 'aws-cdk-lib/aws-autoscaling';


export class WordpressAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'WordpressAppQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });

    // CDK Code for Launch Template with Userdata
    
    const EC2UserData = `
      #!/bin/bash
      echo "Running custom user data script"
      yum install httpd php php-mysql -y
      yum update -y
      cd /var/www/html
      echo "healthy" > healthy.html
      wget https://wordpress.org/wordpress-6.7.1.tar.gz
      tar -xzf wordpress-6.7.1.tar.gz
      cp -r wordpress/* /var/www/html/
      rm -rf wordpress
      rm -rf wordpress-6.7.1.tar.gz
      chmod -R 755 wp-content
      chown -R apache:apache wp-content
      service httpd start
      chkconfig httpd on
    `;
    const ec2LaunchTemplate = new ec2.CfnLaunchTemplate(this, 'EC2LaunchTemplate', {
      launchTemplateName: "Wordpress-Launch-Template",
      versionDescription: "v1",
      launchTemplateData: {
        instanceType: 't2.micro',
        imageId: "ami-0d1e3f2707b2b8925",
        userData: cdk.Fn.base64(EC2UserData),
        securityGroupIds: ["sg-033f9342dfa7287cb"],
      },
    });


    // ALB Target Group


    // ALB Load Balancer


    // ALB Lisener

    // AutoScaling Group


    // RDS Instance




  }
}
