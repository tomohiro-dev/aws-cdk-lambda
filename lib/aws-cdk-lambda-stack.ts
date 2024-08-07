import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from "aws-cdk-lib/aws-lambda"

export class AwsCdkLambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // lambda関数を作成する
    const dockerFunc = this.createLambdaFunction();
    
    // lambda関数にURLを追加する
    const functionUrl = this.addFunctionUrl(dockerFunc);

    // CloudFormationに出力値を追加する
    this.addFunctionUrlOutput(functionUrl);
  }

  // Lambda関数を作成するメソッド
  private createLambdaFunction(): lambda.DockerImageFunction {
    return new lambda.DockerImageFunction(this, "DockerFunc", {
      code: lambda.DockerImageCode.fromImageAsset("./image"),
      memorySize: 1024,
      timeout: cdk.Duration.seconds(10),
      architecture: lambda.Architecture.ARM_64
    });
  }

  // Lambda関数にURLを追加するメソッド
  private addFunctionUrl(dockerFunc: lambda.DockerImageFunction): lambda.FunctionUrl {
    const corsSettings = {
      allowedMethods: [lambda.HttpMethod.ALL],
      allowedHeaders: ["*"],
      allowedOrigins: ["*"],
    };

    return dockerFunc.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
      cors: corsSettings
    });
  }

    // CloudFormationに出力値を追加するメソッド
    private addFunctionUrlOutput(functionUrl: lambda.FunctionUrl): void {
      new cdk.CfnOutput(this, "FunctionUrlValue", {
        value: functionUrl.url,
      });
    }
}