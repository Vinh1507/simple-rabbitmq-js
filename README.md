# simple-rabbitmq-js

## Architecture

![alt text](./images/architecture.png)
## Implementation

### Both of producers send messages
![alt text](./images/both-producers-send.png)

### 2 competing consumers receive messages
![alt text](./images/competing-consumers-receive.png)

### 1 single consumer receives messages
![alt text](./images/single-consumer-receives.png)


## Note

- The single consumer can use a random queue name when binding to the exchange. But all of competing consumers have to bind <b>one specific queue name</b> to the exchange

- In this project, all of competing consumers use a 'letterbox' queue 