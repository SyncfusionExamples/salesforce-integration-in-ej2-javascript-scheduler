public with sharing class SchedulerData {
    @RemoteAction
    @AuraEnabled(cacheable=true)
    public static Map<String, Object> getEvents() {
 
        // fetching the Events via salesforce backend
        List<SchedulerEvent__c> Events = new List<SchedulerEvent__c>();
        Events = [SELECT Id, Name, Start_Time__c, End_Time__c, IsAllDay__c,
            Location__c, RecurrenceRule__c FROM SchedulerEvent__c];
 
        Map<String, Object> result = new Map<String, Object>{'events' => Events };
        return result;
   }
}