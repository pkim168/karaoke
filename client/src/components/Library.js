import React, { useState, useMemo } from 'react';
import '../../node_modules/bootstrap/dist/js/bootstrap.min.js';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { useTable, useFilters, useGlobalFilter, useAsyncDebounce } from 'react-table';
import { InputGroup, FormControl } from 'react-bootstrap';
import { matchSorter } from 'match-sorter';

function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const [value, setValue] = useState(globalFilter)
  const onChange = useAsyncDebounce(value => {
    setGlobalFilter(value || undefined)
  }, 200)

  return (
    <div className="input-group mb-3">
      <div className="input-group-prepend">
        <span className="input-group-text" id="basic-addon1">Search:</span>
      </div>
      <input type="text" className="form-control" placeholder="" aria-label="Username" aria-describedby="basic-addon1" value={value || ""}
        onChange={e => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
      />
    </div>
  )
}

function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter },
}) {
  const count = preFilteredRows.length

  return (
    <input
      value={filterValue || ''}
      onChange={e => {
        setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ${count} records...`}
    />
  )
}

function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [row => row.values[id]] })
}

const TableComponent = (props) => {
  const defaultColumn = useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    []
  )

  const filterTypes = useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows, id, filterValue) => {
        return rows.filter(row => {
          const rowValue = row.values[id]
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true
        })
      },
    }),
    []
  );

  const columns = useMemo(
    () => [
      {
        Header: 'Code',
        accessor: 'code', // accessor is the "key" in the data
        show: false
      },
      {
        Header: 'Title',
        accessor: 'title',
      },
      {
        Header: 'Artist',
        accessor: 'artist',
      },
      {
        Header: '',
        accessor: 'button',
        Cell: ({ row: { original } }) => {
          return (<button className="btn btn-outline-dark" onClick={() => props.addSong(original)}>Add to Queue</button>)
        },
      },
      {
        Header: '',
        accessor: 'options',
        Cell: ({ row: { original } }) => {
          return (<button className="btn btn-outline-dark" data-toggle="modal" data-target="#optionModal" onClick={() => {
            props.setOption(original);
            document.getElementById("editTitle").value = original.title;
            document.getElementById("editArtist").value = original.artist;
          }} >Options</button>)
        },
      },
    ],[]
  );


  const data = useMemo(() => {
    var tableData = props.library;
    return tableData.map(function(song, i) {
      return (
        {
          code: song.code,
          title: song.title,
          artist: song.artist,
          url: song.url,
          index: i
        }
      );
    })}, [props.library]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    preGlobalFilteredRows,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      defaultColumn, // Be sure to pass the defaultColumn option
      filterTypes,
    },
    useFilters, // useFilters!
    useGlobalFilter // useGlobalFilter!
  )

  const table = (
    <>
      <GlobalFilter
        preGlobalFilteredRows={preGlobalFilteredRows}
        globalFilter={state.globalFilter}
        setGlobalFilter={setGlobalFilter}
      />
      <table className="table table-hover table-sm" {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr className="d-flex" {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th className="col" {...column.getHeaderProps()}>
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="scroll" {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row)
            return (
              <tr className="d-flex" {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return <td className="col" {...cell.getCellProps()}>{cell.render('Cell')}</td>
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
      <div className="modal fade" id="optionModal" tabIndex="-1" role="dialog" aria-labelledby="optionModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="optionModalLabel">{props.option.title}</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <InputGroup className="mb-3">
                <InputGroup.Prepend>
                  <InputGroup.Text id="basic-addon2">Title</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  id="editTitle"
                  placeholder="Title"
                  aria-label="editTitle"
                  aria-describedby="basic-addon2"
                />
              </InputGroup>
              <InputGroup className="mb-3">
                <InputGroup.Prepend>
                  <InputGroup.Text id="basic-addon3">Artist</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  id="editArtist"
                  placeholder="Artist"
                  aria-label="editArtist"
                  aria-describedby="basic-addon3"
                />
              </InputGroup>
              {/*<InputGroup className="mb-3">
                <InputGroup.Prepend>
                  <InputGroup.Text id="basic-addon3">Tags</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  id="editTags"
                  placeholder="Tags"
                  aria-label="tags"
                  aria-describedby="basic-addon3"
                />
              </InputGroup>*/}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
              <button type="button" className="btn btn-danger" data-dismiss="modal" data-toggle="modal" data-target="#deleteModal" >Delete</button>
              <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={() => {
                var title = document.getElementById("editTitle").value;
                var artist = document.getElementById("editArtist").value;
                props.editLibrary({"code": props.option.code, "title": title, "artist": artist});
                return;
              }}>Save changes</button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="deleteModal" tabIndex="-1" role="dialog" aria-labelledby="deleteModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="deleteModalLabel">Are you sure you want to delete?</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
              <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={() => {
                props.deleteSong(props.option);
                return;
              }}>Delete</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
  return table;
}

function Library(props) {

  var [option, setOption] = useState('');

  return (
    <div className="table-fixed">
      <TableComponent setOption={setOption} option={option} {...props}/>
    </div>
  );
}

export default Library;

// Library reads from json
// whenever video is added to queue, check if already in library.
// If so dont do anything
// If not, ask if want to add to library. If so, prompt for song name and artist. then add to json and current library state
