import { before, create } from '../utils/JqueryWrappers'
import { isVeriosnAfter13 } from '../utils/Utils'

/**
 * Creates the hidden upload area container that the rest of the module
 * uses to render image previews.
 *
 * This is the <div> that FileProcessor.ts searches for with:
 *   find('#ci-chat-upload-area', sidebar)
 */
const createUploadArea = (): JQuery => {
  console.log('[CI:DEBUG] createUploadArea → creating <div id="ci-chat-upload-area" class="hidden">')
  return create(`<div id="ci-chat-upload-area" class="hidden"></div>`)
}

/**
 * Initializes the upload area in the chat sidebar.
 *
 * - Locates the chat controls container using the known V13+ global ID (#chat-controls)
 * - Inserts the upload area just before the controls
 *
 * NOTE: This function is responsible for making sure #ci-chat-upload-area
 * actually exists in the DOM. If this fails, FileProcessor.addImageToQueue()
 * will never find it and you’ll see the "uploadArea NOT FOUND" logs.
 */
export const initUploadArea = (sidebar: JQuery) => {
  console.log('[CI:DEBUG] initUploadArea → START', { sidebar })

  // Foundry V13+ DOM structure uses:
  //
  // <div id="chat-controls" class="flexrow">
  //
  // This MUST exist for the upload area to be inserted correctly.
  const chatControls = $('#chat-controls')
  console.log('[CI:DEBUG] initUploadArea → global #chat-controls lookup result:', chatControls)

  // If we didn’t find any element matching that selector, we can’t insert our upload area.
  // This is a key failure mode on newer Foundry versions when DOM structure changes.
  if (!chatControls || !chatControls[0]) {
    console.warn(
      '[CI:DEBUG] initUploadArea → #chat-controls NOT FOUND. ' +
      'Upload area will NOT be inserted; FileProcessor will not work.'
    )
    return
  }

  // Create the actual upload area <div id="ci-chat-upload-area" class="hidden"></div>
  const uploadArea: JQuery = createUploadArea()
  console.log('[CI:DEBUG] initUploadArea → created uploadArea element:', uploadArea)

  // Insert the upload area just BEFORE the chat controls in the DOM.
  // Visually, this means the image preview row appears above the chat input.
  before(chatControls, uploadArea)
  console.log('[CI:DEBUG] initUploadArea → inserted uploadArea before #chat-controls')

  console.log('[CI:DEBUG] initUploadArea → END')
}
