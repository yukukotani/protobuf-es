// Copyright 2021-2022 Buf Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// @generated by protoc-gen-es v0.2.1 with parameter "target=ts"
// @generated from file proto/person.proto (package example, syntax proto3)
/* eslint-disable */
/* @ts-nocheck */

import type {BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage} from "@bufbuild/protobuf";
import {Message, proto3, protoInt64, Timestamp} from "@bufbuild/protobuf";

/**
 * @generated from enum example.Availability
 */
export enum Availability {
  /**
   * @generated from enum value: UNKNOWN = 0;
   */
  UNKNOWN = 0,

  /**
   * @generated from enum value: YES = 1;
   */
  YES = 1,

  /**
   * @generated from enum value: NO = 2;
   */
  NO = 2,
}
// Retrieve enum metadata with: proto3.getEnumType(Availability)
proto3.util.setEnumType(Availability, "example.Availability", [
  { no: 0, name: "UNKNOWN" },
  { no: 1, name: "YES" },
  { no: 2, name: "NO" },
]);

export interface IOneOfStatus {
    status: string;
}

/**
 * @generated from message example.OneOfStatus
 */
export class OneOfStatus extends Message<OneOfStatus> {
  /**
   * @generated from field: string status = 1;
   */
  status = "";

  constructor(data?: PartialMessage<OneOfStatus>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime = proto3;
  static readonly typeName = "example.OneOfStatus";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "status", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): OneOfStatus {
    return new OneOfStatus().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): OneOfStatus {
    return new OneOfStatus().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): OneOfStatus {
    return new OneOfStatus().fromJsonString(jsonString, options);
  }

  static equals(a: OneOfStatus | PlainMessage<OneOfStatus> | undefined, b: OneOfStatus | PlainMessage<OneOfStatus> | undefined): boolean {
    return proto3.util.equals(OneOfStatus, a, b);
  }
}

export interface IOneOfSwitch {
    switch: boolean;
}

/**
 * @generated from message example.OneOfSwitch
 */
export class OneOfSwitch extends Message<OneOfSwitch> {
  /**
   * @generated from field: bool switch = 1;
   */
  switch = false;

  constructor(data?: PartialMessage<OneOfSwitch>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime = proto3;
  static readonly typeName = "example.OneOfSwitch";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "switch", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): OneOfSwitch {
    return new OneOfSwitch().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): OneOfSwitch {
    return new OneOfSwitch().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): OneOfSwitch {
    return new OneOfSwitch().fromJsonString(jsonString, options);
  }

  static equals(a: OneOfSwitch | PlainMessage<OneOfSwitch> | undefined, b: OneOfSwitch | PlainMessage<OneOfSwitch> | undefined): boolean {
    return proto3.util.equals(OneOfSwitch, a, b);
  }
}

export interface INonPhones {
    fax: number;
    carrierPigeon: string;
}

/**
 * @generated from message example.NonPhones
 */
export class NonPhones extends Message<NonPhones> {
  /**
   * @generated from field: int32 fax = 1;
   */
  fax = 0;

  /**
   * @generated from field: string carrier_pigeon = 2;
   */
  carrierPigeon = "";

  constructor(data?: PartialMessage<NonPhones>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime = proto3;
  static readonly typeName = "example.NonPhones";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "fax", kind: "scalar", T: 5 /* ScalarType.INT32 */ },
    { no: 2, name: "carrier_pigeon", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): NonPhones {
    return new NonPhones().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): NonPhones {
    return new NonPhones().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): NonPhones {
    return new NonPhones().fromJsonString(jsonString, options);
  }

  static equals(a: NonPhones | PlainMessage<NonPhones> | undefined, b: NonPhones | PlainMessage<NonPhones> | undefined): boolean {
    return proto3.util.equals(NonPhones, a, b);
  }
}

export interface IPerson {
    name: string;
    id: number;
    email: string;
    active: boolean;
    nyetphones: Person_PhoneNumber[];
    nyetlastUpdated: Timestamp;
    qux: {
        case: string | undefined;
        value?: unknown;
    };
    baz: {
        case: string | undefined;
        value?: unknown;
    };
    mapping: { [key: number]: string };
    availability: Availability;
    aliases: string[];
    bigNumber: bigint;
}

/**
 * @generated from message example.Person
 */
export class Person extends Message<Person> {
  /**
   * @generated from field: string name = 1;
   */
  name = "";

  /**
   * Unique ID number for this person.
   *
   * @generated from field: int32 id = 2;
   */
  id = 0;

  /**
   * @generated from field: string email = 3;
   */
  email = "";

  /**
   * @generated from field: bool active = 4;
   */
  active = false;

  /**
   * @generated from field: repeated example.Person.PhoneNumber phones = 5;
   */
  phones: Person_PhoneNumber[] = [];

  /**
   * @generated from field: google.protobuf.Timestamp last_updated = 6;
   */
  lastUpdated?: Timestamp;

  /**
   * @generated from oneof example.Person.qux
   */
  qux: {
    /**
     * @generated from field: string quux = 8;
     */
    value: string;
    case: "quux";
  } | {
    /**
     * @generated from field: int32 bing = 9;
     */
    value: number;
    case: "bing";
  } | { case: undefined; value?: undefined } = { case: undefined };

  /**
   * @generated from oneof example.Person.baz
   */
  baz: {
    /**
     * @generated from field: example.OneOfStatus statusO = 10;
     */
    value: OneOfStatus;
    case: "statusO";
  } | {
    /**
     * @generated from field: example.OneOfSwitch switchO = 11;
     */
    value: OneOfSwitch;
    case: "switchO";
  } | { case: undefined; value?: undefined } = { case: undefined };

  /**
   * @generated from field: map<int32, string> mapping = 12;
   */
  mapping: { [key: number]: string } = {};

  /**
   * @generated from field: example.Availability availability = 13;
   */
  availability = Availability.UNKNOWN;

  /**
   * @generated from field: repeated string aliases = 14;
   */
  aliases: string[] = [];

  /**
   * @generated from field: int64 big_number = 15;
   */
  bigNumber = protoInt64.zero;

  constructor(data?: PartialMessage<Person>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime = proto3;
  static readonly typeName = "example.Person";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "name", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "id", kind: "scalar", T: 5 /* ScalarType.INT32 */ },
    { no: 3, name: "email", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 4, name: "active", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
    { no: 5, name: "phones", kind: "message", T: Person_PhoneNumber, repeated: true },
    { no: 6, name: "last_updated", kind: "message", T: Timestamp },
    { no: 8, name: "quux", kind: "scalar", T: 9 /* ScalarType.STRING */, oneof: "qux" },
    { no: 9, name: "bing", kind: "scalar", T: 5 /* ScalarType.INT32 */, oneof: "qux" },
    { no: 10, name: "statusO", kind: "message", T: OneOfStatus, oneof: "baz" },
    { no: 11, name: "switchO", kind: "message", T: OneOfSwitch, oneof: "baz" },
    { no: 12, name: "mapping", kind: "map", K: 5 /* ScalarType.INT32 */, V: {kind: "scalar", T: 9 /* ScalarType.STRING */} },
    { no: 13, name: "availability", kind: "enum", T: proto3.getEnumType(Availability) },
    { no: 14, name: "aliases", kind: "scalar", T: 9 /* ScalarType.STRING */, repeated: true },
    { no: 15, name: "big_number", kind: "scalar", T: 3 /* ScalarType.INT64 */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Person {
    return new Person().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Person {
    return new Person().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Person {
    return new Person().fromJsonString(jsonString, options);
  }

  static equals(a: Person | PlainMessage<Person> | undefined, b: Person | PlainMessage<Person> | undefined): boolean {
    return proto3.util.equals(Person, a, b);
  }
}

/**
 * @generated from enum example.Person.PhoneType
 */
export enum Person_PhoneType {
  /**
   * @generated from enum value: MOBILE = 0;
   */
  MOBILE = 0,

  /**
   * @generated from enum value: HOME = 1;
   */
  HOME = 1,

  /**
   * @generated from enum value: WORK = 2;
   */
  WORK = 2,
}
// Retrieve enum metadata with: proto3.getEnumType(Person_PhoneType)
proto3.util.setEnumType(Person_PhoneType, "example.Person.PhoneType", [
  { no: 0, name: "MOBILE" },
  { no: 1, name: "HOME" },
  { no: 2, name: "WORK" },
]);

export interface IPerson_PhoneNumber {
    number: string;
    type: Person_PhoneType;
    non: INonPhones;
}

/**
 * @generated from message example.Person.PhoneNumber
 */
export class Person_PhoneNumber extends Message<Person_PhoneNumber> {
  /**
   * @generated from field: string number = 1;
   */
  number = "";

  /**
   * @generated from field: example.Person.PhoneType type = 2;
   */
  type = Person_PhoneType.MOBILE;

  /**
   * @generated from field: example.NonPhones non = 3;
   */
  non?: NonPhones;

  constructor(data?: PartialMessage<Person_PhoneNumber>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime = proto3;
  static readonly typeName = "example.Person.PhoneNumber";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "number", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "type", kind: "enum", T: proto3.getEnumType(Person_PhoneType) },
    { no: 3, name: "non", kind: "message", T: NonPhones },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Person_PhoneNumber {
    return new Person_PhoneNumber().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Person_PhoneNumber {
    return new Person_PhoneNumber().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Person_PhoneNumber {
    return new Person_PhoneNumber().fromJsonString(jsonString, options);
  }

  static equals(a: Person_PhoneNumber | PlainMessage<Person_PhoneNumber> | undefined, b: Person_PhoneNumber | PlainMessage<Person_PhoneNumber> | undefined): boolean {
    return proto3.util.equals(Person_PhoneNumber, a, b);
  }
}

