import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import * as rds from 'aws-cdk-lib/aws-rds';

export class WordpressVpcStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'WordpressAppQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });

    //VPC with SSM Param


    //SG-ALB with SSM Param


    //SG-EC2 with SSM Param


    //SG-RDS with SSM Param


    //SG-Subnet-Group with SSM Param



  }
}
