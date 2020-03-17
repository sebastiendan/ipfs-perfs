import { makeStyles, Theme } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import axios from 'axios'
import MUIDataTable from 'mui-datatables'
import React from 'react'
import NumberFormat from 'react-number-format'

import { NodeAPI } from '@ipfs-perfs/models'
import { assignCancelToken, cancelEffectCleaning } from '../../config'

let cancelRequest

const BufferSizeNumber = value => {
  let computedValue = value
  let suffix = 'KB'

  if (value >= 1000) {
    computedValue = value / 1000
    suffix = ' MB'
  }

  return (
    <NumberFormat displayType="text" suffix={suffix} value={computedValue} />
  )
}

const LatencyNumber = value => (
  <NumberFormat
    decimalScale={2}
    displayType="text"
    suffix=" ms"
    thousandSeparator={true}
    value={value}
  />
)

const useStyles = makeStyles((theme: Theme) => ({
  loader: {
    marginRight: theme.spacing(1.5),
    opacity: 0.5,
  },
  root: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2.5),
  },
  tableRoot: {
    backgroundColor: theme.palette.background.default,
    marginTop: theme.spacing(2),
  },
}))

const NodeAPIPage: React.FC = () => {
  const classes = useStyles()
  const [data, setData] = React.useState<NodeAPI.Datum[]>()
  const [isLoading, setIsLoading] = React.useState(false)

  React.useEffect(() => {
    return cancelEffectCleaning(cancelRequest)
  }, [])

  const handleStart = () => {
    setData(undefined)
    setIsLoading(true)

    axios
      .post('/api/node-api/start', {
        cancelToken: assignCancelToken(cancelRequest),
      })
      .then(res => setData(res.data))
      .catch()
      .then(() => {
        setIsLoading(false)
      })
  }

  return (
    <div className={classes.root}>
      <Button
        disabled={isLoading}
        color="primary"
        onClick={handleStart}
        variant="outlined"
      >
        {isLoading && <CircularProgress className={classes.loader} size={22} />}
        Start
      </Button>
      {data !== undefined && (
        <>
          <MUIDataTable
            className={classes.tableRoot}
            columns={[
              {
                label: 'Buffer size',
                name: 'bufferSizeInKB',
                options: {
                  customBodyRender: BufferSizeNumber,
                },
              },
              {
                label: 'Average',
                name: 'average',
                options: {
                  customBodyRender: LatencyNumber,
                },
              },
              {
                label: 'Min',
                name: 'min',
                options: {
                  customBodyRender: LatencyNumber,
                },
              },
              {
                label: 'Max',
                name: 'max',
                options: {
                  customBodyRender: LatencyNumber,
                },
              },
              {
                label: 'Standard deviation',
                name: 'stddev',
                options: {
                  customBodyRender: LatencyNumber,
                },
              },
            ]}
            data={data.map(({ bufferSizeInKB, write }) => ({
              ...write,
              bufferSizeInKB,
            }))}
            options={{
              download: false,
              filter: false,
              pagination: false,
              print: false,
              selectableRows: 'none',
              selectableRowsHeader: false,
              search: false,
              sort: false,
              viewColumns: false,
            }}
            title="Write"
          />
          <MUIDataTable
            className={classes.tableRoot}
            columns={[
              {
                label: 'Buffer size',
                name: 'bufferSizeInKB',
                options: {
                  customBodyRender: BufferSizeNumber,
                },
              },
              {
                label: 'Average',
                name: 'average',
                options: {
                  customBodyRender: LatencyNumber,
                },
              },
              {
                label: 'Min',
                name: 'min',
                options: {
                  customBodyRender: LatencyNumber,
                },
              },
              {
                label: 'Max',
                name: 'max',
                options: {
                  customBodyRender: LatencyNumber,
                },
              },
              {
                label: 'Standard deviation',
                name: 'stddev',
                options: {
                  customBodyRender: LatencyNumber,
                },
              },
            ]}
            data={data.map(({ bufferSizeInKB, read }) => ({
              ...read,
              bufferSizeInKB,
            }))}
            options={{
              download: false,
              filter: false,
              pagination: false,
              print: false,
              selectableRows: 'none',
              selectableRowsHeader: false,
              search: false,
              sort: false,
              viewColumns: false,
            }}
            title="Read"
          />
        </>
      )}
    </div>
  )
}

export default NodeAPIPage
