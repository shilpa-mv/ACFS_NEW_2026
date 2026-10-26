@API @APITest @regression
Feature: User API validation

  Scenario: Verify user details using GET API
    When I fetch user details
    Then API response status should be 200
    And user id should be 1
    And user name should be "Leanne Graham"
    And user email should be "Sincere@april.biz"
