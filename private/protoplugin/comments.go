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

package protoplugin

import (
	"fmt"
	"strings"

	"google.golang.org/protobuf/types/descriptorpb"
)

// The following field numbers are used to find comments in
// google.protobuf.SourceCodeInfo.
const (
	fieldNumber_FileDescriptorProto_Package     = 2
	fieldNumber_FileDescriptorProto_MessageType = 4
	fieldNumber_FileDescriptorProto_EnumType    = 5
	fieldNumber_FileDescriptorProto_Service     = 6
	fieldNumber_FileDescriptorProto_Extension   = 7
	fieldNumber_FileDescriptorProto_Syntax      = 12
	fieldNumber_DescriptorProto_Field           = 2
	fieldNumber_DescriptorProto_NestedType      = 3
	fieldNumber_DescriptorProto_EnumType        = 4
	fieldNumber_DescriptorProto_OneofDecl       = 8
	fieldNumber_EnumDescriptorProto_Value       = 2
	fieldNumber_ServiceDescriptorProto_Method   = 2
)

type jsDocBlock struct {
	lines []string
}

func newJsDocBlock() *jsDocBlock {
	return &jsDocBlock{}
}

func (j *jsDocBlock) add(text string) {
	text = strings.TrimSuffix(text, "\n")
	text = strings.ReplaceAll(text, "*/", "*\\/")
	lines := strings.Split(text, "\n")
	j.lines = append(j.lines, lines...)
}

func (j *jsDocBlock) empty() bool {
	return len(j.lines) == 0
}

func (j *jsDocBlock) indentedString(indent string) string {
	var buf strings.Builder
	if len(j.lines) > 0 {
		_, _ = fmt.Fprintf(&buf, "%s/**\n", indent)
		for _, line := range j.lines {
			_, _ = fmt.Fprintf(&buf, "%s *%s\n", indent, line)
		}
		_, _ = fmt.Fprintf(&buf, "%s */", indent)
	}
	return buf.String()
}

type CommentSet struct {
	LeadingDetached []string
	Leading         string
	Trailing        string
}

func newCommentSet(sourceCodeInfo *descriptorpb.SourceCodeInfo, sourcePath []int32) CommentSet {
	set := CommentSet{}
	for _, location := range sourceCodeInfo.GetLocation() {
		if len(location.Path) != len(sourcePath) {
			continue
		}
		pathMatches := true
		for index, want := range location.Path {
			if sourcePath[index] != want {
				pathMatches = false
				break
			}
		}
		if !pathMatches {
			continue
		}
		set.Leading = location.GetLeadingComments()
		set.Trailing = location.GetTrailingComments()
		set.LeadingDetached = location.GetLeadingDetachedComments()
	}
	return set
}

func makeFilePreamble(gen *Generator, fileName string, packageName string, syntax ProtoSyntax, syntaxComments CommentSet, packageComments CommentSet) string {
	var builder strings.Builder
	writeLeadingComments(&builder, syntaxComments)
	writeGenerationInfo(&builder, gen, fileName, packageName, syntax)
	if gen.ESLintDisable {
		_, _ = builder.WriteString("/* eslint-disable */\n")
	}
	if gen.TSNoCheck {
		_, _ = builder.WriteString("/* @ts-nocheck */\n")
	}
	_, _ = builder.WriteString("\n")
	writeLeadingComments(&builder, packageComments)
	return strings.TrimSuffix(builder.String(), "\n")
}

func writeGenerationInfo(builder *strings.Builder, gen *Generator, fileName string, packageName string, syntax ProtoSyntax) {
	_, _ = fmt.Fprintf(builder, "// @generated by %s %s", gen.Options.Name, gen.Options.Version)
	if gen.Request.GetParameter() != "" {
		_, _ = fmt.Fprintf(builder, ` with parameter "%s"`, gen.Request.GetParameter())
	}
	_, _ = builder.WriteString("\n")
	_, _ = fmt.Fprintf(builder, "// @generated from file %s (", fileName)
	if packageName != "" {
		_, _ = fmt.Fprintf(builder, "package %s, ", packageName)
	}
	_, _ = fmt.Fprintf(builder, "syntax %s)\n", syntax)
}

func writeLeadingComments(builder *strings.Builder, comments CommentSet) {
	for _, comment := range comments.LeadingDetached {
		comment = strings.TrimSuffix(comment, "\n")
		for _, line := range strings.Split(comment, "\n") {
			_, _ = builder.WriteString("//" + line + "\n")
		}
		_, _ = builder.WriteString("\n")
	}
	if comment := comments.Leading; comment != "" {
		comment = strings.TrimSuffix(comment, "\n")
		for _, line := range strings.Split(comment, "\n") {
			_, _ = builder.WriteString("//" + line + "\n")
		}
		_, _ = builder.WriteString("\n")
	}
}