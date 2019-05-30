// match valid resource names
// https://github.com/sensu/sensu-go/blob/0d61cbddf963c2c62d04ccb56b23d9605ac4d770/api/core/v2/validators.go#L13-L14
const nameRegex = /^[\w.-]+$/;

// match valid subscription names including entitiy subscriptions
// https://github.com/sensu/sensu-go/blob/0d61cbddf963c2c62d04ccb56b23d9605ac4d770/api/core/v2/validators.go#L20-L23
const subscriptionNameRegex = /^[\w.-]+:?[\w.-]+$/;

export const validName = name => nameRegex.test(name);
export const validSubscriptionName = name => subscriptionNameRegex.test(name);
