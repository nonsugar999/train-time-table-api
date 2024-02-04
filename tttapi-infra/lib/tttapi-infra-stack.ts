import { Duration, Stack, StackProps } from "aws-cdk-lib"
import { Construct } from "constructs"
import { aws_iam as iam } from "aws-cdk-lib"
import { Runtime } from "aws-cdk-lib/aws-lambda"
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs"

export interface CustomizedProps extends StackProps {
  projectName: string;
}

export class TttapiInfraStack extends Stack {
  constructor(scope: Construct, id: string, props: CustomizedProps) {
    super(scope, id, props)


    const iamRoleForLambda = new iam.Role(this, "iamRoleForLambda", {
      roleName: `${props.projectName}-lambda-role`,
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
    })

    const timeTableLambda = new NodejsFunction(this, "GETTimeTable", {
      entry: "lambda/time_table/get.ts",
      runtime: Runtime.NODEJS_LATEST,
      timeout: Duration.seconds(30),
      role: iamRoleForLambda,
      environment: {
        AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      },
      memorySize: 128
    })
  }
}
