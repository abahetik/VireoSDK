// Copyright (c) 2021 National Instruments
// SPDX-License-Identifier: MIT

describe('A via file with debug point ', function () {
    'use strict';
    // Reference aliases
    const vireoHelpers = window.vireoHelpers;
    const vireoRunner = window.testHelpers.vireoRunner;
    const fixtures = window.testHelpers.fixtures;

    let vireo;

    const simpleAddNodeViaUrl = fixtures.convertToAbsoluteFromFixturesDir('debugpoint/SimpleAddNode.via');
    const addNodeWithCaseStructureViaUrl = fixtures.convertToAbsoluteFromFixturesDir('debugpoint/AddNodeWithCaseStructure.via');

    beforeAll(function (done) {
        fixtures.preloadAbsoluteUrls([
            simpleAddNodeViaUrl,
            addNodeWithCaseStructureViaUrl
        ], done);
    });

    beforeAll(async function () {
        vireo = await vireoHelpers.createInstance();
    });

    afterAll(function () {
        vireo = undefined;
    });

    it('on executing succesfully set the needs update property on corresponding local ', async function () {
        const runSlicesAsync = vireoRunner.rebootAndLoadVia(vireo, simpleAddNodeViaUrl);
        const sumIndicator = vireo.eggShell.findValueRef('MyVI', 'dataItem_Sum');
        expect(vireo.eggShell.testNeedsUpdateAndReset(sumIndicator)).toBeFalse();
        const {rawPrint, rawPrintError} = await runSlicesAsync();
        expect(rawPrint).toBeEmptyString();
        expect(rawPrintError).toBeEmptyString();
        expect(vireo.eggShell.testNeedsUpdateAndReset(sumIndicator)).toBeTrue();
    });

    it('on not executing will not set the needs update property on corresponding local', async function () {
        const runSlicesAsync = vireoRunner.rebootAndLoadVia(vireo, addNodeWithCaseStructureViaUrl);
        const sumIndicator = vireo.eggShell.findValueRef('MyVI', 'dataItem_Sum');
        expect(vireo.eggShell.testNeedsUpdateAndReset(sumIndicator)).toBeFalse();
        const {rawPrint, rawPrintError} = await runSlicesAsync();
        expect(rawPrint).toBeEmptyString();
        expect(rawPrintError).toBeEmptyString();
        expect(vireo.eggShell.testNeedsUpdateAndReset(sumIndicator)).toBeFalse();
    });
});
