// Copyright (c) 2020 Gitpod GmbH. All rights reserved.
// Licensed under the GNU Affero General Public License (AGPL).
// See License.AGPL.txt in the project root for license information.

package cmd

import (
	"fmt"
	"os"

	"github.com/gitpod-io/gitpod/ws-manager/api"
	"github.com/spf13/cobra"
	"google.golang.org/protobuf/encoding/protojson"
)

// debugPortSpec
var debugPortSpec = &cobra.Command{
	Use:   "decode-portspec <str>",
	Short: "Decodes and marshals an port spec to JSON from a base64-encoded protobuf string",
	Args:  cobra.ExactArgs(1),
	RunE: func(cmd *cobra.Command, args []string) error {
		port, err := api.ExposedPortsFromBase64(args[0])
		if err != nil {
			return err
		}
		marshaler := protojson.MarshalOptions{
			Indent:         "  ",
			UseEnumNumbers: true,
		}

		b, err := marshaler.Marshal(port)
		if err != nil {
			return err
		}

		_, err = fmt.Fprint(os.Stdout, string(b))
		return err
	},
}

func init() {
	debugCmd.AddCommand(debugPortSpec)
}
