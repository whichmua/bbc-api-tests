Feature: Functional Manual Testing

  Scenario: The channel should have a schedule when "has_schedule" is true
    Given I access the API at "https://testapi.io/api/RMSTest/ibltest"
    Then the channel metadata should have fields "id", "type", "title", and "has_schedule"
    And if "has_schedule" is true
    Then there should be at least one program in the schedule
    And if "has_schedule" is false
    Then the schedule should be empty

  Scenario: Programs should not overlap and their durations should be accurate
    Given I access the API at "https://testapi.io/api/RMSTest/ibltest"
    Then each program’s "scheduled_start" should be before its "scheduled_end"
    And consecutive programs should not overlap
    And the "duration" should match the difference between "scheduled_start" and "scheduled_end"

  Scenario: Multiple versions should have unique metadata and download options
    Given I access the API at "https://testapi.io/api/RMSTest/ibltest"
    Then each version of the episode should have a unique ID
    And for downloadable versions, the "download" field should be true and "availability" should show the remaining time
