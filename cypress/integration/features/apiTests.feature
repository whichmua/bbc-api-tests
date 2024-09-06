Feature: API testing for the schedule endpoint

  Scenario: 01 Verify response status and time for schedule API
    Given I send a GET request to "/ibltest"
    Then the status code should be "200"
    And the response time should be under "1000" ms

  Scenario: 02 Validate "id" and "type" fields for schedule items
    Given I send a GET request to "/ibltest"
    Then all items should have a non-empty "id"
    And the "type" field inside each "episode" object should always have the value "episode"

  Scenario: 03 Ensure "title" field is populated
    Given I send a GET request to "/ibltest"
    Then each schedule item should have a non-empty "title" in "episode"

  Scenario: 04 Count live episodes
    Given I send a GET request to "/ibltest"
    Then there should be "1" episode where "live" in "episode" is "true"

  Scenario: 05 Validate transmission times
    Given I send a GET request to "/ibltest"
    Then the "transmission_start" should precede the "transmission_end"

  Scenario: 06 Validate response header date
    Given I send a GET request to "/ibltest"
    Then the "date" in the header should be present and in a valid format

  Scenario: 07 Validate 404 for invalid date
    Given I send a GET request to "/ibltest/2023-09-11"
    Then the status code should be "404"
    And the error object should include "details"
    And the error object should include "http_response_code"