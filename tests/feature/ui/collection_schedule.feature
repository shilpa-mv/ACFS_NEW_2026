@UI @Collectionschedule @regression
Feature: Collection Schedule

  Scenario: Open the collection schedule module
    Given I am on the CSP Login page
    When I enter valid CSP credentials
    Then I should be logged in successfully
    Then I navigate to the collection scheduling
