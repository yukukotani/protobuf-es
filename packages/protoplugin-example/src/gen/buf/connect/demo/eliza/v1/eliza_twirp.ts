// Copyright 2022 Buf Technologies, Inc.
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

// @generated by protoc-gen-twirp-es v0.2.1 with parameter "target=ts"
// @generated from file buf/connect/demo/eliza/v1/eliza.proto (package buf.connect.demo.eliza.v1, syntax proto3)
/* eslint-disable */
/* @ts-nocheck */

import type {JsonValue, Message} from "@bufbuild/protobuf";
import {SayRequest, SayResponse} from "./eliza_pb.js";

/**
 * ElizaService provides a way to talk to the ELIZA, which is a port of
 * the DOCTOR script for Joseph Weizenbaum's original ELIZA program.
 * Created in the mid-1960s at the MIT Artificial Intelligence Laboratory,
 * ELIZA demonstrates the superficiality of human-computer communication.
 * DOCTOR simulates a psychotherapist, and is commonly found as an Easter
 * egg in emacs distributions.
 *
 * @generated from service buf.connect.demo.eliza.v1.ElizaService
 */
export class ElizaServiceClient {
    private baseUrl: string = '';

    constructor(url: string) {
        this.baseUrl = url;
    }

    async request<T extends Message<T>>(
        service: string,
        method: string,
        contentType: string,
        data: T
    ) {
        const headers = new Headers([]);
        headers.set('content-type', contentType);
        const response = await fetch(
            `${this.baseUrl}/${service}/${method}`,
            {
                method: 'POST',
                headers,
                body: data.toJsonString(),
            }
        );
        if (response.status === 200) {
            if (contentType === 'application/json') {
                return await response.json();
            }
            return new Uint8Array(await response.arrayBuffer());
        }
        throw Error(`HTTP ${response.status} ${response.statusText}`)
    }

    /**
     * Say is a unary request demo. This method should allow for a one sentence
     * response given a one sentence request.
     *
     * @generated from rpc buf.connect.demo.eliza.v1.ElizaService.Say
     */
    async say(request: SayRequest): Promise<SayResponse> {
        const promise = this.request(
            "buf.connect.demo.eliza.v1.ElizaService", 
            "Say",
            "application/json",
            request
        );
        return promise.then(async (data) =>
             SayResponse.fromJson(data as JsonValue)
        );
    }
}
