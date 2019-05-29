const nameRegex = /^[\w.-]+$/g;
const subscriptionNameRegex = /^[\w.-]+:?[\w.-]+$/g;

const validateWithPattern = (name, pattern) => {
  if (name && !name.search) {
    return false;
  }

  return name.search(pattern) >= 0;
};

export const validName = name => validateWithPattern(name, nameRegex);

export const validSubscriptionName = name =>
  validateWithPattern(name, subscriptionNameRegex);
