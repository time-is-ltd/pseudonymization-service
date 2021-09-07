# Data modifications

This document shows how proxy treats specific parts of the outgoing data.
Operations marked '*' are customizable and depends on a proxy configuration.

| Operation                           | Meaning                                                                                                                            |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `✓`                                 | No change to value.                                                                                                                |
| `removed`                           | Value is completely cleared. Default value is returned instead (empty string for string, false for boolean, 0 for numbers)         |
| `pseudonymized`                     | Value or its part, which might contain PII (Personally Identifiable Information) are pseudonymized according to [pseudonymization configuration](../README.md) ([how it works](how-it-works.md)).                               |
| `derived (extracted domains)`       | Domain names are extracted from the value according to [configuration](../README.md). Everything else is stripped.                                                            |
| `derived (file content type)`       | File content type is derived from the value. Everything else is stripped.                                                          |

## Office 365

### User calendars

```yaml
'@odata.context': removed
'@odata.nextLink': pseudonymized *
value:
  - id: ✓
    name: removed
    color: ✓
    hexColor: ✓
    isDefaultCalendar: ✓
    changeKey: ✓
    canShare: ✓
    canViewPrivateItems: ✓
    isShared: ✓
    isSharedWithMe: ✓
    canEdit: ✓
    allowedOnlineMeetingProviders: ✓
    defaultOnlineMeetingProvider: ✓
    isTallyingResponses: ✓
    isRemovable: ✓
    owner:
      name: removed
      address: pseudonymized *
```

### User events

```yaml
'@odata.context': removed
'@odata.nextLink': pseudonymized *
value:
  - id: ✓
    iCalUId: ✓
    subject: derived (extracted domains only) *
    bodyPreview: removed
    body:
      contentType: derived (file content type only) *
      content: derived (extracted domains only) *
    categories: ✓
    changeKey: ✓
    start:
      dateTime: ✓
      timeZone: ✓
    end:
      dateTime: ✓
      timeZone: ✓
    location:
      address:
        city: ✓
        countryOrRegion: ✓
        postalCode: ✓
        postOfficeBox: ✓
        state: ✓
        street: ✓
        type: ✓
      coordinates:
        accuracy: ✓
        altitude: ✓
        altitudeAccuracy: ✓
        latitude: ✓
        longitude: ✓
      displayName: removed
      locationType: ✓
      locationEmailAddress: pseudonymized *
      locationUri: removed
      uniqueId: ✓
      uniqueIdType: ✓
    locations:
      - address:
          city: ✓
          countryOrRegion: ✓
          postalCode: ✓
          postOfficeBox: ✓
          state: ✓
          street: ✓
          type: ✓
        coordinates:
          accuracy: ✓
          altitude: ✓
          altitudeAccuracy: ✓
          latitude: ✓
          longitude: ✓
        displayName: removed
        locationType: ✓
        locationEmailAddress: pseudonymized *
        locationUri: removed
        uniqueId: ✓
        uniqueIdType: ✓
    attendees:
      - type: ✓
        status:
          response: ✓
          time: ✓
        emailAddress:
          name: removed
          address: pseudonymized *
        proposedNewTime:
          start:
            dateTime: ✓
            timeZone: ✓
          end:
            dateTime: ✓
            timeZone: ✓
    organizer:
      emailAddress:
        name: removed
        address: pseudonymized *
    allowNewTimeProposals: ✓
    createdDateTime: ✓
    hasAttachments: ✓
    uid: ✓
    importance: ✓
    isAllDay: ✓
    isCancelled: ✓
    isDraft: ✓
    isOnlineMeeting: ✓
    isOrganizer: ✓
    isReminderOn: ✓
    lastModifiedDateTime: ✓
    onlineMeeting:
      conferenceId: ✓
      joinUrl: derived (extracted domains only) *
      phones:
        - number: removed
          type: ✓
      quickDial: removed
      tollFreeNumbers: removed
      tollNumber: removed
    onlineMeetingProvider: ✓
    onlineMeetingUrl: derived (extracted domains only) *
    originalEndTimeZone: ✓
    originalStart: ✓
    originalStartTimeZone: ✓
    recurrence:
      pattern:
        dayOfMonth: ✓
        daysOfWeek: ✓
        firstDayOfWeek: ✓
        index: ✓
        interval: ✓
        month: ✓
        type: ✓
      range:
        endDate: ✓
        numberOfOccurrences: ✓
        recurrenceTimeZone: ✓
        startDate: ✓
        type: ✓
    reminderMinutesBeforeStart: ✓
    responseRequested: ✓
    responseStatus:
      response: ✓
      time: ✓
    sensitivity: ✓
    seriesMasterId: ✓
    showAs: ✓
    type: ✓
    webLink: removed
    attachments:
      - contentType: derived (file content type only) *
        id: ✓
        isInline: ✓
        lastModifiedDateTime: ✓
        name: derived (file extension type only)
        size: ✓
    calendar:
      id: ✓
      name: removed
      color: ✓
      hexColor: ✓
      isDefaultCalendar: ✓
      changeKey: ✓
      canShare: ✓
      canViewPrivateItems: ✓
      isShared: ✓
      isSharedWithMe: ✓
      canEdit: ✓
      allowedOnlineMeetingProviders: ✓
      defaultOnlineMeetingProvider: ✓
      isTallyingResponses: ✓
      isRemovable: ✓
      owner:
        name: removed
        address: pseudonymized *
    extensions:
      - id: ✓
```

### User messages

```yaml
'@odata.context': removed
'@odata.nextLink': pseudonymized *
value:
  - id: pseudonymized *
    createdDateTime: ✓
    lastModifiedDateTime: ✓
    changeKey: pseudonymized *
    categories: ✓
    receivedDateTime: ✓
    sentDateTime: ✓
    hasAttachments: ✓
    internetMessageId: pseudonymized *
    subject: removed
    bodyPreview: removed
    importance: ✓
    parentFolderId: pseudonymized *
    conversationId: pseudonymized *
    conversationIndex: ✓
    isDeliveryReceiptRequested: ✓
    isReadReceiptRequested: ✓
    isRead: ✓
    isDraft: ✓
    webLink: removed
    inferenceClassification: ✓
    unsubscribeData: removed
    unsubscribeEnabled: ✓
    mentionsPreview:
      isMentioned: ✓
    body:
      contentType: derived (file content type only) *
      content: derived (extracted domains only) *
    uniqueBody:
      contentType: derived (file content type only) *
      content: derived (extracted domains only) *
    sender:
      emailAddress:
        name: removed
        address: pseudonymized *
    from:
      emailAddress:
        name: removed
        address: pseudonymized *
    toRecipients:
      - emailAddress:
          name: removed
          address: pseudonymized *
    ccRecipients:
      - emailAddress:
          name: removed
          address: pseudonymized *
    bccRecipients:
      - emailAddress:
          name: removed
          address: pseudonymized *
    replyTo:
      - emailAddress:
          name: removed
          address: pseudonymized *
    mentions:
      - application: ✓
        clientReference: ✓
        createdBy:
          name: removed
          address: pseudonymized *
        createdDateTime: ✓
        deepLink: removed
        id: ✓
        mentioned:
          name: removed
          address: pseudonymized *
        mentionText: removed
        serverCreatedDateTime: ✓
    attachments:
      - contentType: derived (file content type only) *
        id: ✓
        isInline: ✓
        lastModifiedDateTime: ✓
        name: derived (file extension type only)
        size: ✓
    extensions:
      - id: ✓
    internetMessageHeaders:
      - name: references
        value: ✓
      - name: delivered-to
        value: pseudonymized *
      - name: message-id
        value: pseudonymized *
      - name: reply-to
        value: pseudonymized *
      - name: sender
        value: pseudonymized *
      - name: cc
        value: pseudonymized *
      - name: bcc
        value: pseudonymized *
      - name: from
        value: pseudonymized *
      - name: to
        value: pseudonymized *
      - name: resent-from
        value: pseudonymized *
      - name: resent-to
        value: pseudonymized *
      - name: resent-sender
        value: pseudonymized *
      - name: resent-cc
        value: pseudonymized *
      - name: bcc
        value: pseudonymized *
      - name: resent-bcc
        value: pseudonymized *
      - name: in-reply-to
        value: pseudonymized *
      - name: resent-msg-id
        value: ✓
      - name: resent-message-id
        value: ✓
      - name: resent-date
        value: ✓
      - name: date
        value: ✓
      - name: content-type
        value: derived (file content type only) *
    flag:
      flagStatus: ✓
      completedDateTime:
        dateTime: ✓
        timeZone: ✓
      dueDateTime:
        dateTime: ✓
        timeZone: ✓
      startDateTime:
        dateTime: ✓
        timeZone: ✓
```

### User mail folders

```yaml
'@odata.context': removed
value:
  - childFolderCount: ✓
    displayName: removed
    id: ✓
    isHidden: ✓
    parentFolderId: ✓
    totalItemCount: removed
    unreadItemCount: removed
```

### User id

```yaml
'@odata.context': removed
id: ✓
displayName: removed
givenName: removed
jobTitle: removed
mail: pseudonymized *
mobilePhone: removed
officeLocation: removed
preferredLanguage: ✓
surname: removed
userPrincipalName: pseudonymized *
```

### Mail folder

```yaml
childFolderCount: ✓
displayName: removed
id: ✓
isHidden: ✓
parentFolderId: ✓
totalItemCount: removed
unreadItemCount: removed
```

### Call records

```yaml
'@odata.context': removed
'@odata.nextLink': ✓
id: ✓
version: ✓
type: ✓
modalities: ✓
lastModifiedDateTime: ✓
startDateTime: ✓
endDateTime: ✓
joinWebUrl: ✓
organizer:
  application:
    displayName: removed
    id: ✓
    tenantId: ✓
  applicationInstance:
    displayName: removed
    id: ✓
    tenantId: ✓
  device:
    displayName: removed
    id: ✓
    tenantId: ✓
  user:
    displayName: removed
    id: ✓
    tenantId: ✓
  conversation:
    displayName: removed
    id: ✓
    tenantId: ✓
  conversationIdentityType:
    displayName: removed
    id: ✓
    tenantId: ✓
  encrypted:
    displayName: removed
    id: ✓
    tenantId: ✓
  guest:
    displayName: removed
    id: ✓
    tenantId: ✓
  phone:
    displayName: removed
    id: ✓
    tenantId: ✓
  acsUser:
    displayName: removed
    id: ✓
    tenantId: ✓
  spoolUser:
    displayName: removed
    id: ✓
    tenantId: ✓
  onPremises:
    displayName: removed
    id: ✓
    tenantId: ✓
  acsApplicationInstance:
    displayName: removed
    id: ✓
    tenantId: ✓
  spoolApplicationInstance:
    displayName: removed
    id: ✓
    tenantId: ✓
participants:
  - application:
      displayName: removed
      id: ✓
      tenantId: ✓
    applicationInstance:
      displayName: removed
      id: ✓
      tenantId: ✓
    device:
      displayName: removed
      id: ✓
      tenantId: ✓
    user:
      displayName: removed
      id: ✓
      tenantId: ✓
    conversation:
      displayName: removed
      id: ✓
      tenantId: ✓
    conversationIdentityType:
      displayName: removed
      id: ✓
      tenantId: ✓
    encrypted:
      displayName: removed
      id: ✓
      tenantId: ✓
    guest:
      displayName: removed
      id: ✓
      tenantId: ✓
    phone:
      displayName: removed
      id: ✓
      tenantId: ✓
    acsUser:
      displayName: removed
      id: ✓
      tenantId: ✓
    spoolUser:
      displayName: removed
      id: ✓
      tenantId: ✓
    onPremises:
      displayName: removed
      id: ✓
      tenantId: ✓
    acsApplicationInstance:
      displayName: removed
      id: ✓
      tenantId: ✓
    spoolApplicationInstance:
      displayName: removed
      id: ✓
      tenantId: ✓
sessions@odata.context: ✓
sessions@odata.nextLink: ✓
sessions:
  - id: ✓
    caller:
      identity:
        application:
          displayName: removed
          id: ✓
          tenantId: ✓
        applicationInstance:
          displayName: removed
          id: ✓
          tenantId: ✓
        device:
          displayName: removed
          id: ✓
          tenantId: ✓
        user:
          displayName: removed
          id: ✓
          tenantId: ✓
        conversation:
          displayName: removed
          id: ✓
          tenantId: ✓
        conversationIdentityType:
          displayName: removed
          id: ✓
          tenantId: ✓
        encrypted:
          displayName: removed
          id: ✓
          tenantId: ✓
        guest:
          displayName: removed
          id: ✓
          tenantId: ✓
        phone:
          displayName: removed
          id: ✓
          tenantId: ✓
        acsUser:
          displayName: removed
          id: ✓
          tenantId: ✓
        spoolUser:
          displayName: removed
          id: ✓
          tenantId: ✓
        onPremises:
          displayName: removed
          id: ✓
          tenantId: ✓
        acsApplicationInstance:
          displayName: removed
          id: ✓
          tenantId: ✓
        spoolApplicationInstance:
          displayName: removed
          id: ✓
          tenantId: ✓
    callee:
      identity:
        application:
          displayName: removed
          id: ✓
          tenantId: ✓
        applicationInstance:
          displayName: removed
          id: ✓
          tenantId: ✓
        device:
          displayName: removed
          id: ✓
          tenantId: ✓
        user:
          displayName: removed
          id: ✓
          tenantId: ✓
        conversation:
          displayName: removed
          id: ✓
          tenantId: ✓
        conversationIdentityType:
          displayName: removed
          id: ✓
          tenantId: ✓
        encrypted:
          displayName: removed
          id: ✓
          tenantId: ✓
        guest:
          displayName: removed
          id: ✓
          tenantId: ✓
        phone:
          displayName: removed
          id: ✓
          tenantId: ✓
        acsUser:
          displayName: removed
          id: ✓
          tenantId: ✓
        spoolUser:
          displayName: removed
          id: ✓
          tenantId: ✓
        onPremises:
          displayName: removed
          id: ✓
          tenantId: ✓
        acsApplicationInstance:
          displayName: removed
          id: ✓
          tenantId: ✓
        spoolApplicationInstance:
          displayName: removed
          id: ✓
          tenantId: ✓
    failureInfo:
      reason: ✓
      stage: ✓
    modalities: ✓
    startDateTime: ✓
    endDateTime: ✓
```

### Call records sessions

```yaml
'@odata.context': removed
'@odata.nextLink': ✓
value:
  - id: ✓
    caller:
      identity:
        application:
          displayName: removed
          id: ✓
          tenantId: ✓
        applicationInstance:
          displayName: removed
          id: ✓
          tenantId: ✓
        device:
          displayName: removed
          id: ✓
          tenantId: ✓
        user:
          displayName: removed
          id: ✓
          tenantId: ✓
        conversation:
          displayName: removed
          id: ✓
          tenantId: ✓
        conversationIdentityType:
          displayName: removed
          id: ✓
          tenantId: ✓
        encrypted:
          displayName: removed
          id: ✓
          tenantId: ✓
        guest:
          displayName: removed
          id: ✓
          tenantId: ✓
        phone:
          displayName: removed
          id: ✓
          tenantId: ✓
        acsUser:
          displayName: removed
          id: ✓
          tenantId: ✓
        spoolUser:
          displayName: removed
          id: ✓
          tenantId: ✓
        onPremises:
          displayName: removed
          id: ✓
          tenantId: ✓
        acsApplicationInstance:
          displayName: removed
          id: ✓
          tenantId: ✓
        spoolApplicationInstance:
          displayName: removed
          id: ✓
          tenantId: ✓
    callee:
      identity:
        application:
          displayName: removed
          id: ✓
          tenantId: ✓
        applicationInstance:
          displayName: removed
          id: ✓
          tenantId: ✓
        device:
          displayName: removed
          id: ✓
          tenantId: ✓
        user:
          displayName: removed
          id: ✓
          tenantId: ✓
        conversation:
          displayName: removed
          id: ✓
          tenantId: ✓
        conversationIdentityType:
          displayName: removed
          id: ✓
          tenantId: ✓
        encrypted:
          displayName: removed
          id: ✓
          tenantId: ✓
        guest:
          displayName: removed
          id: ✓
          tenantId: ✓
        phone:
          displayName: removed
          id: ✓
          tenantId: ✓
        acsUser:
          displayName: removed
          id: ✓
          tenantId: ✓
        spoolUser:
          displayName: removed
          id: ✓
          tenantId: ✓
        onPremises:
          displayName: removed
          id: ✓
          tenantId: ✓
        acsApplicationInstance:
          displayName: removed
          id: ✓
          tenantId: ✓
        spoolApplicationInstance:
          displayName: removed
          id: ✓
          tenantId: ✓
    failureInfo:
      reason: ✓
      stage: ✓
    modalities: ✓
    startDateTime: ✓
    endDateTime: ✓
```
