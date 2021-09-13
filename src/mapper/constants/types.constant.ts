export const TYPES = {
  // String values
  String: Symbol('String'),
  Text: Symbol('Text'),
  Id: Symbol('Id'),
  ContentType: Symbol('ContentType'),
  Datetime: Symbol('Datetime'),
  Email: Symbol('Email'),
  EmailOrHashed: Symbol('EmailOrHash'),
  ETag: Symbol('ETag'),
  ExtractedDomains: Symbol('ExtractedDomain'),
  Filename: Symbol('Filename'),
  Url: Symbol('Url'),
  Proxify: Symbol('Profixy'),
  Username: Symbol('Username'),

  // Numeric values
  Number: Symbol('Number'),

  // Boolean avalues
  Boolean: Symbol('Boolean'),

  // Other
  Passthrough: Symbol('Passthrough'),
  Hashed: Symbol('Hashed'),
  Private: Symbol('Private'),
  Array: Symbol('Array')
}
