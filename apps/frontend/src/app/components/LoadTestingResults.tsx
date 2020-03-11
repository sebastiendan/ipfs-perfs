import { makeStyles, Theme } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import MUIDataTable from 'mui-datatables'
import React from 'react'
import NumberFormat from 'react-number-format'

const useStyles = makeStyles((theme: Theme) => ({
  // '@global': {
  '.MuiPaper-root': {
    backgroundColor: theme.palette.background.default,
  },
  // },
  button: {
    margin: theme.spacing(1),
  },
  flexContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: theme.spacing(4),
  },
  summary: {
    backgroundColor: theme.palette.primary.dark,
    borderRadius: theme.shape.borderRadius,
    color: theme.palette.common.white,
    display: 'table',
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1),
    padding: theme.spacing(1),
  },
}))

interface Props {
  newCallback: () => void
  type: 'read' | 'write'
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

const RequestNumber = value => (
  <NumberFormat
    decimalScale={0}
    displayType="text"
    suffix=" req/s"
    thousandSeparator={true}
    value={value}
  />
)

const NetworkBenchmarkPage: React.FC<Props> = (props: Props) => {
  const classes = useStyles()
  const { newCallback, type } = props
  const [data, setData] = React.useState()
  let eventSource

  React.useEffect(function initEventSource() {
    eventSource = new EventSource(`/api/load-testing/${type}/results`)
    eventSource.onmessage = event => {
      const data = JSON.parse(event.data)
      setData(data)
    }

    return function cleaning() {
      eventSource.close()
    }
  }, [])

  const handleNewBenchmark = React.useCallback(() => {
    setData(undefined)
    newCallback()
  }, [])

  return (
    <>
      {data !== undefined && (
        <>
          <Button
            className={classes.button}
            variant="outlined"
            color="secondary"
            onClick={handleNewBenchmark}
          >
            New
          </Button>
          <div>
            <NumberFormat
              value={
                data['1xx'] +
                data['2xx'] +
                data['3xx'] +
                data['4xx'] +
                data['5xx']
              }
              displayType="text"
              renderText={formattedValue => (
                <div className={classes.summary}>{formattedValue}</div>
              )}
              suffix={` requests sent in ${data.duration}s`}
              thousandSeparator={true}
            />
            <MUIDataTable
              columns={[
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
                {
                  label: '1%',
                  name: 'p1',
                  options: {
                    customBodyRender: LatencyNumber,
                  },
                },
                {
                  name: 'p50',
                  label: '50%',
                  options: {
                    customBodyRender: LatencyNumber,
                  },
                },
                {
                  label: '97.5%',
                  name: 'p97_5',
                  options: {
                    customBodyRender: LatencyNumber,
                  },
                },
                {
                  label: '99%',
                  name: 'p99',
                  options: {
                    customBodyRender: LatencyNumber,
                  },
                },
              ]}
              data={data !== undefined ? [data.latency] : []}
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
              title="Latency"
            />
            <MUIDataTable
              columns={[
                {
                  label: 'Average',
                  name: 'average',
                  options: {
                    customBodyRender: RequestNumber,
                  },
                },
                {
                  label: 'Min',
                  name: 'min',
                  options: {
                    customBodyRender: RequestNumber,
                  },
                },
                {
                  label: 'Max',
                  name: 'max',
                  options: {
                    customBodyRender: RequestNumber,
                  },
                },
                {
                  label: 'Standard deviation',
                  name: 'stddev',
                  options: {
                    customBodyRender: RequestNumber,
                  },
                },
                {
                  label: '1%',
                  name: 'p1',
                  options: {
                    customBodyRender: RequestNumber,
                  },
                },
                {
                  label: '50%',
                  name: 'p50',
                  options: {
                    customBodyRender: RequestNumber,
                  },
                },
                {
                  label: '97.5%',
                  name: 'p97_5',
                  options: {
                    customBodyRender: RequestNumber,
                  },
                },
                {
                  label: '99%',
                  name: 'p99',
                  options: {
                    customBodyRender: RequestNumber,
                  },
                },
              ]}
              data={data !== undefined ? [data.requests] : []}
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
              title="Requests"
            />
          </div>
        </>
      )}
    </>
  )
}

export default NetworkBenchmarkPage
