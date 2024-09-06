import { Given, Then } from '@badeball/cypress-cucumber-preprocessor';

let response;

const checkElements = (field, parentField, callback) => {
  const elements = response.body.schedule.elements;

  elements.forEach((item, index) => {
    const value = parentField ? item[parentField][field] : item[field];
    callback(value, index);
  });
};

Given(/^I send a GET request to "(.*)"$/, (url) => {
  cy.request({
    method: 'GET',
    url: `https://testapi.io/api/RMSTest${url}`,
    failOnStatusCode: false
  }).then((res) => {
    response = res;
  });
});

Then(/^the status code should be "(\d+)"$/, (statusCode) => {
  expect(response.status).to.eq(Number(statusCode));
});

Then(/^the response time should be under "(\d+)" ms$/, (time) => {
  expect(response.duration).to.be.lessThan(Number(time));
});

Then(/^all items should have a non-empty "(.*)"$/, (fieldName) => {
  checkElements(fieldName, null, (value) => {
    expect(value).to.not.be.null;
    expect(value).to.not.be.empty;
  });
});

Then(/^the "(.*)" field inside each "(.*)" object should always have the value "(.*)"$/, (field, parentField, expectedValue) => {
  checkElements(field, parentField, (value) => {
    expect(value).to.eq(expectedValue);
  });
});

Then(/^each schedule item should have a non-empty "(.*)" in "(.*)"$/, (field, parentField) => {
  checkElements(field, parentField, (value) => {
    expect(value).to.not.be.null;
    expect(value).to.not.be.empty;
  });
});

Then(/^there should be "(\d+)" episode(s)? where "(.*)" in "(.*)" is "(true|false)"$/, (expectedCount, _, field, parentField, value) => {
  const booleanValue = (value === 'true');
  const matchingItems = response.body.schedule.elements.filter(item => {
    return item[parentField] && item[parentField][field] === booleanValue;
  });

  expect(matchingItems.length).to.eq(parseInt(expectedCount));
});

Then(/^the "(.*)" should precede the "(.*)"$/, (startField, endField) => {
  checkElements(startField, null, (start, index) => {
    const end = new Date(response.body.schedule.elements[index][endField]);

    if (isNaN(new Date(start)) || isNaN(end)) {
      throw new Error(`Invalid date for fields: ${startField} or ${endField}`);
    }

    expect(new Date(start)).to.be.below(end, `${startField} should be before ${endField}`);
  });
});

Then('the "date" in the header should be present and in a valid format', () => {
  const dateHeader = response.headers['date'];
  expect(dateHeader).to.not.be.null;

  const dateRegex = /^[A-Za-z]{3},\s\d{2}\s[A-Za-z]{3}\s\d{4}\s\d{2}:\d{2}:\d{2}\sGMT$/;
  expect(dateHeader).to.match(dateRegex);
});

Then(/^the error object should include "(.*)"$/, (errorProperty) => {
  expect(response.body.error).to.include.all.keys(errorProperty);
});