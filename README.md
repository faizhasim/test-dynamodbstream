# test-dynamodbstream

> My play on dynamodb stream


## Getting Started

1. Setup & wait till table ready

        ./setup.js
        
2. Run

        DEBUG=* ./run.js
        
3. Tear down

        ./teardown.js
        
## Caveats

To prevent me from accidentally create tables on production, I'm using hardcoded `labs` profile at [./lib/aws.js](./lib/aws.js).
Modify as needed.