@UI @CPPortal @regression @Test123
Feature: Customer Portal navigation and dashboard functionality

  Scenario: User can access the Customer Portal and view the dashboard
    Given I am on the login page
    When I sign in to the Customer Portal as the customer user
    Then I should be logged in successfully
    And I should see the dashboard page
    When I click on the Containers
    Then I should see the Containers page
    When I click on the Orders
    Then I should see the Orders page
    When I click on the Delivery Schedules
    Then I should see the Delivery Schedules page
    When I click on the Collections Schedules
    Then I should see the Collections Schedules page
    When I click on the logout button
    Then I should be logged out successfully
