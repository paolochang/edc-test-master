# Test Driven Development

## Index

1. [About Testing](#about-testing)
   1. [Types of Test](#types-of-test)
   2. [What is Testing](#what-is-testing)
   3. [History of Testing](#history-of-testing)
   4. [Advantage of Testing](#advantage-of-testing)
   5. [Test Pyramid](#test-pyramid)
   6. [Jest](#jest)
2. [Testing Principles](#testing-principles)
   1. [Secrets of Test Code](#secrets-of-test-code)
   2. [Structure of Test](#structure-of-test)
   3. [FIRST](#first)
   4. [Right-BICEP](#right-bicep)
3. [References](#references)

## <a name="about-testing"></a>1. About Testing

### <a name="types-of-test"></a>1.1. Types of Test

- Unit Test
- Functional Test
- Integration Test
- Component Test
- Contract Test
- E2E Test

### <a name="what-is-testing"></a>1.2. What is `Testing`

The term `testing` is refer to `software testing`. It means testing an `application`, `function`, `service`, `UI`, `performance` or an `APIs specs` to qualify the quality of the service. Also find any software bugs. Ultimately, this is a job to check if a service work as what we expected.

### <a name="history-of-testing"></a>1.3. History of `Testing`

- Development → QA → Publish
- Development → Automated QA → Publish
- Development & Automated QA → Publish

### <a name="advantage-of-testing"></a>1.4. Advantage of `Testing`

- Expect the operation
- Qualify the requirements
- Predictable issues
- Find bugs easily
- Easy refactoring
- Easy maintenance
- Code quality improvement
- Reduce code dependencies
- Easy to document
- Reduce development time

### <a name="test-pyramid"></a>1.5. Test Pyramid

| Type             | Testing                              | Cost      | Speed |
| ---------------- | ------------------------------------ | --------- | ----- |
| E2E Test         | UI, user tests                       | Expensive | Slow  |
| Integration Test | interaction between modules, classes |           |       |
| Unit Test        | function, module, class              | Cheap     | Fast  |

### <a name="jest"></a>1.6. Jest

`Jest` is a JavaScript Testing Framework with a focus on simplicity. It had been designed to ensure correctness of any JavaScript codebase. It works with projects using: `Babel`, `TypeScript`, `Node`, `React`, `Angular`, `Vue` and more.

- zero config
- snapshots
- isolated
- great api

## <a name="testing-principles"></a>2. Testing Principles

### <a name="secrets-of-test-code"></a>2.1 Secrets of Test Code

1. Support and maintain the test code persistently
2. Be self-sufficient and avoid dependencies
3. Create the reusable test utility to reduce repeated test scenarios
4. Store the test codes separately with the production code which will be deployed
5. Documentize with the test code

### <a name="structure-of-test"></a>2.2 Structure of Test

| Structure  | Functions                                             |
| ---------- | ----------------------------------------------------- |
| Before     | `beforeEach`, `beforeAll`                             |
| Test       | `Arrange`, `Act`, `Assert` OR `Given`, `When`, `Then` |
| After      | `afterEach`, `afterAll`                               |

- `Arrange`, `Given`: prepare an object to test the code
- `Act`, `When`: execute the test code
- `Assert`, `Then`: verify the test result to match with the expectation

### <a name="first"></a>2.3 FIRST

**FIRST**

- **F**ast: remove dependencies to reduce test time (files, database, network)
- **I**solated: test isolated code to prove the unit test
- **R**epeatable: must return the same result all the time (should not be effected by environment or network)
- **S**elf-Validating: validate the test with the Jest API: `expect`, `toBe`, `toEqual`, add `CI/CD`
- **T**imely: write the test code before adding new functions, refactoring, or the deployment

### <a name="right-bicep"></a>2.4 Right-BICEP

- **B**oundary conditions: test all the cases include `null`, `undefined`, `special character`, `invalid format of email`, `small number`, `big number`, `duplicate`, `mis-ordered`
- **I**nverse relationship: must return to the original state by inverse behaviour
- **C**ross-check: is a way of ensuring that everything adds up and balances, much like the general ledger in a double-entry bookkeeping system
- **E**rror conditions: handling all error conditions such as `network error`, `lack of memory`, `database`
- **P**erformance characteristics: test the performance by specific results

## <a name="references"></a>References

- [8 Principles of Better Unit Testing](https://esj.com/Articles/2012/09/24/Better-Unit-Testing.aspx?Page=1)
