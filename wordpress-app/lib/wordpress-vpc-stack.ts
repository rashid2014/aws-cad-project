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

    const customVpc = new ec2.Vpc(this, 'CustomVPC', {
      ipAddresses: ec2.IpAddresses.cidr('10.50.0.0/16'),
      createInternetGateway: true,
    });

    new cdk.CfnOutput(this, 'CustomVPCIDOutput', {
      value: customVpc.vpcId,
      exportName: 'Application-VPC-ID',
    });
    
    const publicSubnets = customVpc.publicSubnets;

    new cdk.CfnOutput(this, 'PublicSubnetID1Output', {
      value: publicSubnets[0].subnetId,
      exportName: 'Public-Subnet1-ID',
    });

    new cdk.CfnOutput(this, 'PublicSubnetID2Output', {
      value: publicSubnets[1].subnetId,
      exportName: 'Public-Subnet2-ID',
    });

    const privateSubnets = customVpc.privateSubnets;

    new cdk.CfnOutput(this, 'PrivateSubnetID1Output', {
      value: privateSubnets[0].subnetId,
      exportName: 'Private-Subnet1-ID',
    });

    new cdk.CfnOutput(this, 'PrivateSubnetID2Output', {
      value: privateSubnets[1].subnetId,
      exportName: 'Private-Subnet2-ID',
    });




    // const publicSubnetIds = customVpc.publicSubnets.map(subnet => subnet.subnetId);

    // Output the public subnet IDs
    // new cdk.CfnOutput(this, 'CustomVPCPublicSubnetIds', {
    //   value: JSON.stringify(publicSubnetIds),
    //   exportName: 'Application-PUBLIC-SUBNET-IDS',
    // });

    // const ssmVPC = new ssm.StringParameter(this, 'vpcSsmParameter', {
    //   parameterName: '/AWS/CAD/VPC/ID',
    //   stringValue: customVpc.vpcId,
    // });


    //SG-ALB with SSM Param

    const albSecurityGroup = new ec2.SecurityGroup(this, 'ALBSecurityGroup', { 
      vpc: customVpc
    });

    albSecurityGroup.addIngressRule(
      ec2.Peer.ipv4("0.0.0.0/0"),
      ec2.Port.tcp(80)
    )

    albSecurityGroup.addIngressRule(
      ec2.Peer.ipv4("0.0.0.0/0"),
      ec2.Port.tcp(443)
    )

    new cdk.CfnOutput(this, 'ALBSGOutput', {
      value: albSecurityGroup.securityGroupId,
      exportName: 'Application-ALB-SG-ID',
    });

    // const ssmALBSG = new ssm.StringParameter(this, 'albSGSsmParameter', {
    //   parameterName: '/AWS/CAD/ALB/SG/ID',
    //   stringValue: albSecurityGroup.securityGroupId,
    // });
    
    //SG-EC2 with SSM Param
    const ec2SecurityGroup = new ec2.SecurityGroup(this, 'EC2SecurityGroup', { 
      vpc: customVpc
    });

    ec2SecurityGroup.addIngressRule(
      ec2.Peer.ipv4("0.0.0.0/0"),
      ec2.Port.tcp(22)
    )

    ec2SecurityGroup.addIngressRule(
      albSecurityGroup,
      ec2.Port.tcp(80)
    )

    ec2SecurityGroup.addIngressRule(
      albSecurityGroup,
      ec2.Port.tcp(443)
    )

    new cdk.CfnOutput(this, 'EC2SGOutput', {
      value: ec2SecurityGroup.securityGroupId,
      exportName: 'Application-EC2-SG-ID',
    });

    // const ssmEC2SG = new ssm.StringParameter(this, 'ec2SGSsmParameter', {
    //   parameterName: '/AWS/CAD/EC2/SG/ID',
    //   stringValue: ec2SecurityGroup.securityGroupId,
    // });

    //SG-RDS with SSM Param

    const rdsSecurityGroup = new ec2.SecurityGroup(this, 'RDSSecurityGroup', { 
      vpc: customVpc
    });

    rdsSecurityGroup.addIngressRule(
      ec2SecurityGroup,
      ec2.Port.tcp(3306)
    )

    new cdk.CfnOutput(this, 'RDSSGOutput', {
      value: rdsSecurityGroup.securityGroupId,
      exportName: 'Application-RDS-SG-ID',
    });

    // const ssmRDSSG = new ssm.StringParameter(this, 'RDSSGSsmParameter', {
    //   parameterName: '/AWS/CAD/RDS/SG/ID',
    //   stringValue: rdsSecurityGroup.securityGroupId,
    // });


    //RDS-Subnet-Group with SSM Param

    const rdsSubnetGroup = new rds.SubnetGroup(this, 'RDSSubnetGroup', {
      description: 'RDS SubnetGroup',
      vpc: customVpc,
    
      // the properties below are optional
      subnetGroupName: 'RDS-SUBNET-GROUP',
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      },
    });

    new cdk.CfnOutput(this, 'RDSSubnetGroupOutput', {
      value: rdsSubnetGroup.subnetGroupName,
      exportName: 'Application-RDS-SUBNET-GROUP-NAME',
    });

    // const ssmRDSSubnetGroup = new ssm.StringParameter(this, 'RDSSubnetGroupSsmParameter', {
    //   parameterName: '/AWS/CAD/RDS/SUBNET/GROUP',
    //   stringValue: rdsSubnetGroup.subnetGroupName,
    // });

  }
}
