import React, { useState } from 'react'
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';


const NewsEditor = (props) => {
    const [editorState, setEditorState] = useState('')
    return (
        <>
            <Editor
                editorState={editorState}
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                // editorClassName={styles.editor}
                onEditorStateChange={(editorState) => {
                    setEditorState(editorState)
                }}
                style={{
                    minHeight: '600px',
                    minWith: '1000px',
                }}
                onBlur={() => {

                    props.getContent(draftToHtml(convertToRaw(editorState.getCurrentContent())));
                }}
            />
        </>
    )
}

export default NewsEditor

