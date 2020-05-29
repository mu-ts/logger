import 'mocha';
import { expect } from 'chai';
import { CreditCardLoggerFilter } from '../../src/index';
import { LoggerStatement } from '../../src/interfaces/LoggerStatement';

describe('CreditCardLoggerFilter', () => {
  describe('construct', () => {
    it('without error', () => {
      expect(new CreditCardLoggerFilter()).to.not.throw;
    });
  });

  describe('filter suspected credit card', () => {
    const creditCardFilter: CreditCardLoggerFilter = new CreditCardLoggerFilter();

    it(`no 'message' or 'data' provided`, () => {
      const statement: LoggerStatement = {
        at: new Date(),
        level: 'debug',
        name: 'test',
      } as LoggerStatement;

      creditCardFilter.filter(statement);
      expect(statement.msg).to.be.undefined;
      expect(statement.data).to.be.undefined;
    });


    it(`from data, 'falsy' tests`, () => {
      const statement: LoggerStatement = {
        at: new Date(),
        level: 'debug',
        name: 'test',
        data: {
          test: ['0'],
          test2: 0,
          test3: false,
          test4: "false",
          test5: [0],
          test6: undefined
        }
      } as LoggerStatement;

      creditCardFilter.filter(statement);
      expect(statement.data).to.not.be.undefined;
      expect(JSON.stringify(statement).includes('>>> REDACTED <<<')).to.be.false;
    });

    it('from message', () => {
      const statement: LoggerStatement = {
        at: new Date(),
        level: 'debug',
        name: 'test',
        msg: 'I have a credit card of 1234 5678 1234 1234',
        data: {},
      } as LoggerStatement;

      creditCardFilter.filter(statement);
      expect(statement.msg).to.not.be.undefined;

      const message: string = statement.msg as string;

      expect(message.endsWith('>>> REDACTED <<<')).to.be.true;
    });

    it('from data', () => {
      const statement: LoggerStatement = {
        at: new Date(),
        level: 'debug',
        name: 'test',
        msg: 'I have a credit card of 1234 5678 1234 1234',
        data: {
          user: {
            credit: 1234567890123456,
            card: '3214 5321 1234 3213',
            bankNumber: 'This is 3214 5321 1234 3213',
          },
        },
      } as LoggerStatement;

      creditCardFilter.filter(statement);

      expect(statement.msg).to.not.be.undefined;
      expect(statement.data).to.not.be.undefined;

      const message: string = statement.msg as string;
      const data: any = statement.data as any;

      expect(message.endsWith('>>> REDACTED <<<')).to.be.true;
      expect(data.user.credit).equals('>>> REDACTED <<<');
      expect(data.user.card).equals('>>> REDACTED <<<');
      expect(data.user.bankNumber.endsWith('>>> REDACTED <<<')).to.be.true;
    });

    it('from data, real event', () => {
      const statement: LoggerStatement = {
        at: "2020-05-28T02:32:32.083Z",
        clazz: "Function",
        func: "handle()",
        msg: "inOut -->",
        data: {
          func: "handle()",
          clazz: "Function",
          msg: "inOut -->",
          args: [
            {
              resource: "/v3/payment-methods",
              path: "/v3/payment-methods",
              httpMethod: "POST",
              headers: {
                Accept: "*/*",
                "Accept-Encoding": "gzip, deflate, br",
                Authorization:
                    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhenAiOiIwYmMyNzUwNi0wM2Q2LTRhZjgtYTc4Yy01OTg0NzFiMTkzY2IiLCJzY29wZSI6InRyYW5zYWN0aW9uczpyZWFkIHRyYW5zYWN0aW9uczpjcmVhdGUgY3VzdG9tZXJzOmNyZWF0ZSBjdXN0b21lcnM6cmVhZCBjdXN0b21lcnM6dXBkYXRlIHBheW1lbnRfbWV0aG9kczpjcmVhdGUgcGF5bWVudF9tZXRob2RzOnJlYWQgcGF5bWVudF9tZXRob2RzOmRlbGV0ZSIsImh0dHBzOi8vYXV0aHZpYS5jb20vcm9sZSI6ImN1c3RvbWVyIiwiaHR0cHM6Ly9hdXRodmlhLmNvbS9tZXJjaGFudCI6IjgwYTBkMTVhLTIxZGQtNGZjMi1hYmRjLTQyYTA4MmIyZTU0ZCIsImh0dHBzOi8vYXV0aHZpYS5jb20vcGFydG5lciI6InBhcnRuZXI2MTA5MTMiLCJpYXQiOjE1OTA2MzMxNDksImV4cCI6MTU5MDYzMzQ0OSwiYXVkIjoiaW50ZWdyYXRpb24uYXBpLmF1dGh2aWEuY29tL3YzIiwiaXNzIjoiaW50ZWdyYXRpb24uYXV0aHZpYS1ub25wcm9kLmNvbSIsInN1YiI6IjIxYTY5M2M1LTBkNDgtNDY1OC1hNjk3LTRjM2Y4ZWExOTdhNSIsImp0aSI6Ijg3MjcwNThmLTRjZmQtNDE1Yy1iN2M2LWVmOTFmNjVhM2M1ZSJ9.hgwb6X0-8_UWmefq9AabHzVmtm7Ki7Zj3-R-F6p9em8",
                "Cache-Control": "no-cache",
                "CloudFront-Forwarded-Proto": "https",
                "CloudFront-Is-Desktop-Viewer": "true",
                "CloudFront-Is-Mobile-Viewer": "false",
                "CloudFront-Is-SmartTV-Viewer": "false",
                "CloudFront-Is-Tablet-Viewer": "false",
                "CloudFront-Viewer-Country": "US",
                "Content-Type": "application/json",
                Host: "integration.authvia-nonprod.com",
                "Postman-Token": "028194eb-516e-418c-8400-e18f737119b0",
                "User-Agent": "PostmanRuntime/7.25.0",
                Via:
                    "1.1 de17ac04d387fbeef4e381db86bf6136.cloudfront.net (CloudFront)",
                "X-Amz-Cf-Id":
                    "4H2W8MjJCAvoXrQTL1QBDfM9hYp1SeS2MuXfTAl_gQ_UhUmA8M4BRg==",
                "X-Amzn-Trace-Id": "Root=1-5ecf22bf-387b3f2ecfb8ce5e41b9ab6e",
                "X-Forwarded-For": "198.154.81.20, 64.252.135.74",
                "X-Forwarded-Port": "443",
                "X-Forwarded-Proto": "https"
              },
              multiValueHeaders: {
                Accept: ["*/*"],
                "Accept-Encoding": ["gzip, deflate, br"],
                Authorization: [
                  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhenAiOiIwYmMyNzUwNi0wM2Q2LTRhZjgtYTc4Yy01OTg0NzFiMTkzY2IiLCJzY29wZSI6InRyYW5zYWN0aW9uczpyZWFkIHRyYW5zYWN0aW9uczpjcmVhdGUgY3VzdG9tZXJzOmNyZWF0ZSBjdXN0b21lcnM6cmVhZCBjdXN0b21lcnM6dXBkYXRlIHBheW1lbnRfbWV0aG9kczpjcmVhdGUgcGF5bWVudF9tZXRob2RzOnJlYWQgcGF5bWVudF9tZXRob2RzOmRlbGV0ZSIsImh0dHBzOi8vYXV0aHZpYS5jb20vcm9sZSI6ImN1c3RvbWVyIiwiaHR0cHM6Ly9hdXRodmlhLmNvbS9tZXJjaGFudCI6IjgwYTBkMTVhLTIxZGQtNGZjMi1hYmRjLTQyYTA4MmIyZTU0ZCIsImh0dHBzOi8vYXV0aHZpYS5jb20vcGFydG5lciI6InBhcnRuZXI2MTA5MTMiLCJpYXQiOjE1OTA2MzMxNDksImV4cCI6MTU5MDYzMzQ0OSwiYXVkIjoiaW50ZWdyYXRpb24uYXBpLmF1dGh2aWEuY29tL3YzIiwiaXNzIjoiaW50ZWdyYXRpb24uYXV0aHZpYS1ub25wcm9kLmNvbSIsInN1YiI6IjIxYTY5M2M1LTBkNDgtNDY1OC1hNjk3LTRjM2Y4ZWExOTdhNSIsImp0aSI6Ijg3MjcwNThmLTRjZmQtNDE1Yy1iN2M2LWVmOTFmNjVhM2M1ZSJ9.hgwb6X0-8_UWmefq9AabHzVmtm7Ki7Zj3-R-F6p9em8"
                ],
                "Cache-Control": ["no-cache"],
                "CloudFront-Forwarded-Proto": ["https"],
                "CloudFront-Is-Desktop-Viewer": ["true"],
                "CloudFront-Is-Mobile-Viewer": ["false"],
                "CloudFront-Is-SmartTV-Viewer": ["false"],
                "CloudFront-Is-Tablet-Viewer": ["false"],
                "CloudFront-Viewer-Country": ["US"],
                "Content-Type": ["application/json"],
                Host: ["integration.authvia-nonprod.com"],
                "Postman-Token": ["028194eb-516e-418c-8400-e18f737119b0"],
                "User-Agent": ["PostmanRuntime/7.25.0"],
                Via: [
                  "1.1 de17ac04d387fbeef4e381db86bf6136.cloudfront.net (CloudFront)"
                ],
                "X-Amz-Cf-Id": [
                  "4H2W8MjJCAvoXrQTL1QBDfM9hYp1SeS2MuXfTAl_gQ_UhUmA8M4BRg=="
                ],
                "X-Amzn-Trace-Id": ["Root=1-5ecf22bf-387b3f2ecfb8ce5e41b9ab6e"],
                "X-Forwarded-For": ["198.154.81.20, 64.252.135.74"],
                "X-Forwarded-Port": ["443"],
                "X-Forwarded-Proto": ["https"]
              },
              queryStringParameters: null,
              multiValueQueryStringParameters: null,
              pathParameters: null,
              stageVariables: null,
              requestContext: {
                resourceId: "0t62bl",
                authorizer: {
                  sub: "21a693c5-0d48-4658-a697-4c3f8ea197a5",
                  iss: "integration.authvia-nonprod.com",
                  "https://authvia.com/merchant":
                      "80a0d15a-21dd-4fc2-abdc-42a082b2e54d",
                  principalId: "21a693c5-0d48-4658-a697-4c3f8ea197a5",
                  integrationLatency: 74,
                  aud: "integration.api.authvia.com/v3",
                  "https://authvia.com/role": "customer",
                  azp: "0bc27506-03d6-4af8-a78c-598471b193cb",
                  scope:
                      "transactions:read transactions:create customers:create customers:read customers:update payment_methods:create payment_methods:read payment_methods:delete",
                  "https://authvia.com/partner": "partner610913",
                  exp: "1590633449",
                  iat: "1590633149",
                  jti: "8727058f-4cfd-415c-b7c6-ef91f65a3c5e"
                },
                resourcePath: "/v3/payment-methods",
                httpMethod: "POST",
                extendedRequestId: "NOJd5G7KIAMF3Qw=",
                requestTime: "28/May/2020:02:32:31 +0000",
                path: "/v3/payment-methods",
                accountId: "625503727885",
                protocol: "HTTP/1.1",
                stage: "integration",
                domainPrefix: "integration",
                requestTimeEpoch: 1590633151217,
                requestId: "0a7070e4-847e-42ee-b9cf-ea035b3ca210",
                identity: {
                  cognitoIdentityPoolId: null,
                  accountId: null,
                  cognitoIdentityId: null,
                  caller: null,
                  sourceIp: "198.154.81.20",
                  principalOrgId: null,
                  accessKey: null,
                  cognitoAuthenticationType: null,
                  cognitoAuthenticationProvider: null,
                  userArn: null,
                  userAgent: "PostmanRuntime/7.25.0",
                  user: null
                },
                domainName: "integration.authvia-nonprod.com",
                apiId: "6zbwrl98wb"
              },
              body:
                  '{\n    "type": "CreditCard",\n    "nameOnCard": "Transactions Creditcard Created",\n    "cardNumber": "4111111111111111",\n    "expirationMonth": 1,\n    "expirationYear": 2031,\n    "streetAddress": "Yeaff Rd.",\n    "zipCode": "90042"\n}',
              isBase64Encoded: false
            },
            {
              callbackWaitsForEmptyEventLoop: true,
              functionVersion: "$LATEST",
              functionName: "transaction-integration-endpoints",
              memoryLimitInMB: "512",
              logGroupName: "/aws/lambda/transaction-integration-endpoints",
              logStreamName: "2020/05/28/[$LATEST]386e2823a6a34153bab75850f883e9f8",
              invokedFunctionArn:
                  "arn:aws:lambda:us-east-1:625503727885:function:transaction-integration-endpoints",
              awsRequestId: "8145f378-4cfc-430e-a5f1-cfd4df4e9143"
            }
          ]
        },
        name: "Function.inOut",
        level: "debug"
      } as unknown as LoggerStatement;

      creditCardFilter.filter(statement);

      expect(statement.msg).to.not.be.undefined;
      expect(statement.data).to.not.be.undefined;
      expect(statement.data.args[0]).to.not.be.undefined;
      expect(statement.data.args[0].body).to.not.be.undefined;

      const data: any = statement.data as any;
      console.log(`statement: ${JSON.stringify(statement, undefined, 3)}`);

      expect(data.args[0].body).includes('>>> REDACTED <<<');
    });

    it('from data when deeply nested, no spaces (i.e. xxxxxxxxxxxxxxxx)', () => {
      const statement: LoggerStatement = {
        at: new Date(),
        level: 'debug',
        name: 'test',
        msg: 'I have a credit card of 4111111111111111',
        data: {
          a: {
            b: {
              c: {
                d: {
                  e: {
                    user: {
                      credit: 1234567890123456,
                      visaCard: 4111111111111111,
                      amexCard: 378282246310005,
                      dinersCard: 30569309025904,
                      innocentValue: '3214532112343213',
                      bankNumber: 'This is 3214532112343213',
                      mastercard: 'This is 5555555555554444',
                      visa: 'This is 4012888888881881',
                      amex: 'This is 378282246310005',
                      diners: 'This is 30569309025904',
                      discover: 'This is 6011111111111117',
                    },
                  },
                },
              },
            },
          },
        },
      } as LoggerStatement;

      creditCardFilter.filter(statement);

      expect(statement.data).to.not.be.undefined;

      const message: string = statement.msg as string;
      const data: any = statement.data as any;
      const nestedData: any = data.a.b.c.d.e.user;

      expect(message.endsWith('>>> REDACTED <<<')).to.be.true;

      expect(nestedData.credit).equals('>>> REDACTED <<<');
      expect(nestedData.visaCard).equals('>>> REDACTED <<<');
      expect(nestedData.amexCard).equals('>>> REDACTED <<<');
      expect(nestedData.dinersCard).equals('>>> REDACTED <<<');
      expect(nestedData.innocentValue).equals('>>> REDACTED <<<');
      expect(nestedData.bankNumber.endsWith('>>> REDACTED <<<')).to.be.true;
      expect(nestedData.mastercard.endsWith('>>> REDACTED <<<')).to.be.true;
      expect(nestedData.visa.endsWith('>>> REDACTED <<<')).to.be.true;
      expect(nestedData.amex.endsWith('>>> REDACTED <<<')).to.be.true;
      expect(nestedData.diners.endsWith('>>> REDACTED <<<')).to.be.true;
      expect(nestedData.discover.endsWith('>>> REDACTED <<<')).to.be.true;
    });

    it('from data when deeply nested, with spaces in between (i.e. xxxx xxxx xxxx xxxx)', () => {
      const statement: LoggerStatement = {
        at: new Date(),
        level: 'debug',
        name: 'test',
        msg: 'I have a credit card of 1234 5678 1234 1234',
        data: {
          a: {
            b: {
              c: {
                d: {
                  e: {
                    user: {
                      innocentValue: '3214 5321 1234 3213',
                      bankNumber: 'This is 3214 5321 1234 3213',
                      amex: '3714 496353 98431',
                      diners: '3056 9309 0259 04',
                      mastercard: '5555 5555 5555 4444',
                      visa: '4111 1111 1111 1111',
                      discover: '6011 1111 1111 1117',
                      amex2: 'This is 3714 496353 98431',
                      diners2: 'This is 3056 9309 0259 04',
                      mastercard2: 'This is 5555 5555 5555 4444',
                      visa2: 'This is 4111 1111 1111 1111',
                      discover2: 'This is 6011 1111 1111 1117',
                    },
                  },
                },
              },
            },
          },
        },
      } as LoggerStatement;

      creditCardFilter.filter(statement);

      expect(statement.data).to.not.be.undefined;

      const message: string = statement.msg as string;
      const data: any = statement.data as any;
      const nestedData: any = data.a.b.c.d.e.user;

      expect(message.endsWith('>>> REDACTED <<<')).to.be.true;

      expect(nestedData.innocentValue).equals('>>> REDACTED <<<');
      expect(nestedData.bankNumber.endsWith('>>> REDACTED <<<')).to.be.true;
      expect(nestedData.mastercard.endsWith('>>> REDACTED <<<')).to.be.true;
      expect(nestedData.visa.endsWith('>>> REDACTED <<<')).to.be.true;
      expect(nestedData.amex.endsWith('>>> REDACTED <<<')).to.be.true;
      expect(nestedData.diners.endsWith('>>> REDACTED <<<')).to.be.true;
      expect(nestedData.discover.endsWith('>>> REDACTED <<<')).to.be.true;
      expect(nestedData.mastercard2.endsWith('>>> REDACTED <<<')).to.be.true;
      expect(nestedData.visa2.endsWith('>>> REDACTED <<<')).to.be.true;
      expect(nestedData.amex2.endsWith('>>> REDACTED <<<')).to.be.true;
      expect(nestedData.diners2.endsWith('>>> REDACTED <<<')).to.be.true;
      expect(nestedData.discover2.endsWith('>>> REDACTED <<<')).to.be.true;
    });

    it(`from data when deeply nested, different scenarios (i.e. json strings, arrays)`, () => {
      const statement: LoggerStatement = {
        at: new Date(),
        level: 'debug',
        name: 'test',
        msg: 'I have a credit card of 1234 5678 1234 1234',
        data: {
          a: {
            b: {
              c: {
                d: {
                  e: {
                    test: {
                      body: 'just a string value',
                      rawBody: '{\n    "type": "CreditCard",\n    "nameOnCard": "Transactions Creditcard Created",\n    "cardNumber": "4111 1111 1111 1111",\n    "expirationMonth": 1,\n    "expirationYear": 2031,\n    "streetAddress": "Yeaff Rd.",\n    "zipCode": "90042"\n}',
                    },
                    body: '{\n    "type": "CreditCard",\n    "nameOnCard": "Transactions Creditcard Created",\n    "cardNumber": "4111111111111111",\n    "expirationMonth": 1,\n    "expirationYear": 2031,\n    "streetAddress": "Yeaff Rd.",\n    "zipCode": "90042"\n}',
                    rawBody: '{\n    "type": "CreditCard",\n    "nameOnCard": "Transactions Creditcard Created",\n    "cardNumber": "4111111111111111",\n    "expirationMonth": 1,\n    "expirationYear": 2031,\n    "streetAddress": "Yeaff Rd.",\n    "zipCode": "90042"\n}',
                    cardArray: [{
                      innocentValue: '3214 5321 1234 3213',
                      bankNumber: 'This is 3214 5321 1234 3213',
                      amex: '3714 496353 98431',
                      diners: '3056 9309 0259 04',
                      mastercard: '5555 5555 5555 4444',
                      visa: '4111 1111 1111 1111',
                      discover: '6011 1111 1111 1117',
                      amex2: 'This is 3714 496353 98431',
                      diners2: 'This is 3056 9309 0259 04',
                      mastercard2: 'This is 5555 5555 5555 4444',
                      visa2: 'This is 4111 1111 1111 1111',
                      discover2: 'This is 6011 1111 1111 1117',
                    }],
                  },
                },
              },
            },
          },
        },
      } as LoggerStatement;

      creditCardFilter.filter(statement);

      expect(statement.data).to.not.be.undefined;

      const data: any = statement.data as any;
      const nestedData: any = data.a.b.c.d.e;

      expect(nestedData.test.body.includes('>>> REDACTED <<<')).to.be.false;
      expect(nestedData.test.rawBody.includes('>>> REDACTED <<<')).to.be.true;
      expect(nestedData.body.includes('>>> REDACTED <<<')).to.be.true;
      expect(nestedData.rawBody.includes('>>> REDACTED <<<')).to.be.true;
      const pm = nestedData.cardArray.shift();
      Object.keys(pm).forEach((card: string) => expect(pm[card].includes('>>> REDACTED <<<')).to.be.true);
    });
  });
});
