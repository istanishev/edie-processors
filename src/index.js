import uuidv1 from 'uuid/v1';
import {EDIE_BLOCK_TYPE} from './blocks/common/base';
import {mainToMjml, mainTotext} from './blocks/main';
import {textToMjml, textToText} from './blocks/text';
import {rowToMjml, rowToText} from './blocks/row';
import {columnToMjml, columnToText} from './blocks/column';
import {buttonToMjml, buttonToText} from './blocks/button';
import {loopToMjml, loopToText} from './blocks/loop';
import {vspacerToMjml, vspacerToText} from './blocks/vspacer';

const blockToMjml = (item, childrenRenderer) => {
    switch (item.type) {
    case EDIE_BLOCK_TYPE.MAIN:
        return mainToMjml(item, childrenRenderer);
    case EDIE_BLOCK_TYPE.TEXT:
        return textToMjml(item);
    case EDIE_BLOCK_TYPE.ROW:
        return rowToMjml(item, childrenRenderer);
    case EDIE_BLOCK_TYPE.COLUMN:
        return columnToMjml(item, childrenRenderer);
    case EDIE_BLOCK_TYPE.BUTTON:
        return buttonToMjml(item);
    case EDIE_BLOCK_TYPE.LOOP:
        return loopToMjml(item, childrenRenderer);
    case EDIE_BLOCK_TYPE.VSPACER:
        return vspacerToMjml(item);
    default:
        return `Conversion of ${item.type} to MJML not implemented.`;
    }
};

const blockToText = (item, childrenRenderer) => {
    switch (item.type) {
    case EDIE_BLOCK_TYPE.MAIN:
        return mainTotext(item, childrenRenderer);
    case EDIE_BLOCK_TYPE.TEXT:
        return textToText(item);
    case EDIE_BLOCK_TYPE.ROW:
        return rowToText(item, childrenRenderer);
    case EDIE_BLOCK_TYPE.COLUMN:
        return columnToText(item, childrenRenderer);
    case EDIE_BLOCK_TYPE.BUTTON:
        return buttonToText(item);
    case EDIE_BLOCK_TYPE.LOOP:
        return loopToText(item, childrenRenderer);
    case EDIE_BLOCK_TYPE.VSPACER:
        return vspacerToText(item);
    default:
        return `Conversion of ${item.type} to TEXT not implemented.`;
    }
};

function edie2hbsmjml(edieJson) {
    if (edieJson.formatVersion !== 'v1.0') {
        return 'Not supported version!';
    }

    return `<mjml>
<mj-head>
    <mj-style inline="inline">
      .text-tiny { font-size: .7em; } 
      .text-small { font-size: .85em; } 
      .text-big { font-size: 1.4em; } 
      .text-huge { font-size: 1.8em; }
      figure.image img{ width: 100%; }
      figure.image.image-style-align-left { margin-left: 0px; }
      figure.image.image-style-align-left img { max-width: 50%; float: left; margin: 1em 1.5em 1em 0em; }
      figure.image.image-style-align-right { margin-right: 0px; }
      figure.image.image-style-align-right img { max-width: 50%; float: right; margin: 1em 0em 1em 1.5em; }
    </mj-style>
</mj-head>
${blockToMjml(edieJson.structure, blockToMjml)}
</mjml>`;
}

function edie2hbstext(edieJson) {
    if (edieJson.formatVersion !== 'v1.0') {
        return 'Not supported version!';
    }

    return blockToText(edieJson.structure, blockToText);
}

const createEmptyFormat = (v) => {
    if (v && v !== 'v1.0') {
        return null;
    }

    return {
        formatVersion: v || 'v1.0',
        mimeHeaders: {
            to: 'a@b.com',
            subject: 'sample email',
        },
        structure: {
            id: 'main',
            type: 'main',
            children: [],
        },
    };
};


function createEmptyBlock(type) {
    let props = {};
    switch (type) {
    case EDIE_BLOCK_TYPE.BUTTON:
        props = {
            backgroundColor: '#188ec5',
            color: '#ffffff',
            textAlign: 'center',
            borderSize: '0px',
            borderColor: 'transparent',
        };
        break;

    case EDIE_BLOCK_TYPE.TEXT:
        props = {
            padding: '0px',
        };
        break;

    case EDIE_BLOCK_TYPE.ROW:
        props = {
            padding: '0px',
        };
        break;

    case EDIE_BLOCK_TYPE.COLUMN:
        props = {
            width: '100%',
            padding: '0px',
        };
        break;

    case EDIE_BLOCK_TYPE.VSPACER:
        props = {
            backgroundColor: '#188ec5',
            height: '2px',
        };
        break;

    default:
        break;
    }

    return {
        id: uuidv1(),
        type: type,
        properties: props,
        children: [EDIE_BLOCK_TYPE.ROW, EDIE_BLOCK_TYPE.COLUMN, EDIE_BLOCK_TYPE.LOOP].includes(type) ? [] : null,
    };
}

export {
    EDIE_BLOCK_TYPE,
    edie2hbsmjml,
    edie2hbstext,
    createEmptyBlock,
    createEmptyFormat,
};
