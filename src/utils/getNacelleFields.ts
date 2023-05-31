import { createClient } from 'contentful-management'
import { ReferenceTableRow } from '../components/NacelleReferences/ReferenceTable'
import { BaseAppSDK } from 'contentful-ui-extensions-sdk'

const getNacelleFields = async (
  cmaAdapter: BaseAppSDK['cmaAdapter'],
  appId: string | undefined,
  spaceId: string,
  envId: string
) => {
  const dataArray: ReferenceTableRow[] = []

  const cma = createClient({ apiAdapter: cmaAdapter })
  const space = await cma.getSpace(spaceId)
  const environment = await space.getEnvironment(envId)
  const contentTypes = await environment.getContentTypes()

  const typesWithWidgets = await Promise.all(
    contentTypes.items.map(async (contentType) => {
      const { controls } = await environment.getEditorInterfaceForContentType(
        contentType.sys.id
      )
      return {
        contentType,
        controls
      }
    })
  )

  typesWithWidgets.forEach((typeWithWidget) => {
    const { controls, contentType } = typeWithWidget
    if (controls) {
      const references = controls.filter(
        (control) => control.widgetId === appId
      )
      if (references) {
        references.forEach((reference) => {
          const field = contentType.fields.find(
            (field) => field.id === reference.fieldId
          )
          const hiddenField = contentType.fields.find(
            (field) => field.id === 'nclRefMap'
          )

          let nacelleReference = ''

          if (field?.type === 'JSON' && hiddenField?.validations) {
            nacelleReference =
              hiddenField.validations[0].linkContentType
                ?.find((type) => type.includes(field.id))
                ?.replace(`${field.id}:`, '') ?? ''
          } else {
            nacelleReference = `N/A (*${field?.name} as string)`
          }

          dataArray.push({
            type: contentType.sys.id,
            field: reference.fieldId,
            nacelleReference,
            link: `https://app.contentful.com/spaces/${spaceId}/environments/${envId}/content_types/${contentType.sys.id}/fields`
          })
        })
      }
    }
  })

  return dataArray
}

export default getNacelleFields
