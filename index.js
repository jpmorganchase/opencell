/******************************************************************************
 *
 * Copyright (c) 2018, the Perspective Authors.
 *
 * This file is part of the Perspective library, distributed under the terms of
 * the Apache License 2.0.  The full license can be found in the LICENSE file.
 *
 */

import perspective from "@finos/perspective";
import {PerspectiveDockPanel, PerspectiveWidget} from "@finos/perspective-phosphor";
import "@finos/perspective-phosphor/src/theme/material/index.less";

import "@finos/perspective-viewer-d3fc";
import "@finos/perspective-viewer-hypergrid";

import {Widget} from "@phosphor/widgets";

import "./style/index.less";

const PY_SERVER = "localhost:8888";
const CONN = perspective.websocket(`ws://${PY_SERVER}/perspective`);

async function get_kdb(query) {
    const resp = await fetch(`http://${PY_SERVER}/kdb`, {
        method: "POST",
        body: query
    });
    const name = await resp.text();
    return CONN.open_table(name);
}

window.addEventListener("load", async () => {
    const workspace = new PerspectiveDockPanel("example");
    Widget.attach(workspace, document.body);

    const perspective_viewer_1 = new PerspectiveWidget("One");
    const perspective_viewer_2 = new PerspectiveWidget("Two");
    workspace.addWidget(perspective_viewer_1);
    workspace.addWidget(perspective_viewer_2, {mode: "split-right", ref: perspective_viewer_1});

    window.onresize = () => workspace.update();

    const table = await get_kdb("trades");
    perspective_viewer_1.load(table);
    perspective_viewer_2.load(table);
});
