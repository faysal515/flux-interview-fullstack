import classnames from 'classnames'
import { useContext, useEffect, useState } from 'react'
import { MatrixTableContext, MatrixTableContextProvider } from './context'

type Props = {
  initialMatrix?: import('../../types').Matrix
} & import('react').HTMLAttributes<HTMLDivElement>

// const isEmptyOrNan = s => s.length === 0 || isNaN(s)

/**
 * Add 4 buttons: 
 * - Cancel to reset the matrix to how it was before changing the values (only when in edit mode)
 * - Edit to make the fields editable (only when not in edit mode)
 * - Clear to completely clear the table
 * - Save to save the table
 * @param param0 
 */
const MatrixTable: import('react').FC<Omit<Props, 'initialMatrix'>> = ({ className, children, ...props }) => {
  // State ------------------------------------------------------------------- //
  const [editing, setEditing] = useState(true)
  const [{ matrix }, dispatch] = useContext(MatrixTableContext)
  // useEffect(() => {
  //   console.log('ch or', props)

  // }, [])

  // Handlers ---------------------------------------------------------------- //
  // You can save (to api) the matrix here. Remember to update originalMatrix when done.
  const save = async () => {
    console.log('>> ', matrix, prices)
  }

  const renderGrid = data => {
    return data.map(d => <td>{d}</td>)
  }

  const handleLightChange = ({tenure, scheme, value}) => {
    const rows = Object.keys(matrix)
    const cols = Object.keys(matrix[rows[0]])

    const changed = {...matrix}
    cols.forEach((item, i) => {
      changed[tenure][item] = Number(value) * (i+1)
    })


    dispatch({
      type: 'SET_MATRIX',
      payload: changed
    })
  }

  const renderTable = () => {
    const rows = Object.keys(matrix) || []
    const cols = rows.length && matrix[rows[0]].length > 0  ? Object.keys(matrix[rows[0]]) : []


    // console.log(rows, cols)
    return (<table>
      <thead>
        <tr>
          <th>#</th>
          {cols.map(c => {
            return <th key={c}>{c}</th>
          })}
        </tr>
      </thead>
      <tbody>
        {rows.map(r => {
          return (<tr key={r}>
            <td>{r}</td>
            <td>
              <input type="number" value={matrix[r].lite}
                min={0}
                onChange={(e) => handleLightChange({
                  tenure: r,
                  scheme: 'lite',
                  value: e.target.value
                })}
              />
            </td>
            <td>
              <input type="number" value={matrix[r].standard}
                min={0}
                onChange={(e) => dispatch({
                  type: 'UPDATE_GRID',
                  payload: {
                    tenure: r,
                    scheme: 'standard',
                    value: e.target.value
                  }
                })}
              />
            </td>
            <td>
              <input type="number" value={matrix[r].unlimited}
                min={0}
                onChange={(e) => dispatch({
                  type: 'UPDATE_GRID',
                  payload: {
                    tenure: r,
                    scheme: 'unlimited',
                    value: e.target.value
                  }
                })}
              />
            </td>
          </tr>)
        })}
      </tbody>
      {/* <tbody>
      <tr>
        <td><input type="text" placeholder='one'/></td>
        <td><input type="text" placeholder='two'/></td>
      </tr>
      <tr>
        <td><input type="text" placeholder='three'/></td>
        <td><input type="text" placeholder='four'/></td>
      </tr>
      </tbody> */}

    </table>)
  }

  const editOrCancel =() => {
    // user wants to cancel changes if editing == true
    if(editing) {
      console.log(',,,,,')
      dispatch({type: 'CANCEL_MATRIX'})
    }
    
    setEditing(!editing)
  }


  // Effects ----------------------------------------------------------------- //

  // Rendering --------------------------------------------------------------- //
  return (
    <div className={classnames(['container', className])} {...props}>
      <button onClick={save}>Save</button>
      <button>Clear</button>
      <button onClick={editOrCancel}>{editing ? 'Cancel': 'Edit'}</button>
      <br />
      <br />

      {renderTable()}

      <style jsx>{`
        .container {
          
        }
      `}</style>
    </div>
  )
}

const MatrixTableWithContext: import('react').FC<Props> = ({ ...props }) => {
  // You can fetch the pricing here or in pages/index.ts
  // Remember that you should try to reflect the state of pricing in originalMatrix.
  // matrix will hold the latest value (edited or same as originalMatrix)

  const [initialData, setInitialData] = useState()
  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch('http://localhost:3000/api/pricing').then(r => r.json())
      console.log('>> ', result)
      setInitialData(result)
    }
 
    console.log('---------------')
    fetchData()
  }, [])
  
  return (
    <MatrixTableContextProvider initialMatrix={initialData}>
      <MatrixTable {...props} />
    </MatrixTableContextProvider>
  )
}

export default MatrixTableWithContext
