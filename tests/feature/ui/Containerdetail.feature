@UI @Containers @regression
Feature: Validate Container Detail Page

  Scenario: User logs in and opens the container detail page
    Given I am on the CSP Login page
    When I enter valid CSP credentials
    Then I should be logged in successfully
    Then I navigate to the Containers Module
    Then I Click on Container number
