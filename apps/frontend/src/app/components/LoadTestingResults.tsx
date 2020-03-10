import { createStyles, makeStyles, Theme } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import MUIDataTable from 'mui-datatables'
import React from 'react'
import NumberFormat from 'react-number-format'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    flexContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginTop: theme.spacing(4),
    },
  })
)

interface Props {
  newCallback: () => void
}

const NetworkBenchmarkPage: React.FC<Props> = (props: Props) => {
  const classes = useStyles()
  const { newCallback } = props
  const [data, setData] = React.useState()

  React.useEffect(function initPerfsEventSource() {
    const perfsEventSource = new EventSource('/api/network-benchmark/results')
    perfsEventSource.onmessage = event => {
      const data = JSON.parse(event.data)
      console.log(data)
      setData(data)
    }
  }, [])

  const handleNewBenchmark = React.useCallback(() => {
    setData(undefined)
    newCallback()
  }, [])

  return (
    <div>
      {data !== undefined && (
        <>
          <Button
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
              displayType={'text'}
              suffix={` requests sent in ${data.duration}s`}
              thousandSeparator={true}
            />
          </div>
          <MUIDataTable
            columns={[
              { label: 'Average', name: 'average' },
              { label: 'Min', name: 'min' },
              { label: 'Max', name: 'max' },
              {
                label: 'Standard deviation',
                name: 'stddev',
              },
              {
                label: '1%',
                name: 'p1',
              },
              {
                label: '50%',
                name: 'p50',
              },
              {
                label: '97.5%',
                name: 'p97_5',
              },
              {
                label: '99%',
                name: 'p99',
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
            title="Latency (ms)"
          />
          <MUIDataTable
            columns={[
              { label: 'Average', name: 'average' },
              { label: 'Min', name: 'min' },
              { label: 'Max', name: 'max' },
              {
                label: 'Standard deviation',
                name: 'stddev',
              },
              {
                label: '1%',
                name: 'p1',
              },
              {
                label: '50%',
                name: 'p50',
              },
              {
                label: '97.5%',
                name: 'p97_5',
              },
              {
                label: '99%',
                name: 'p99',
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
            title="Requests (nbr of requests /s)"
          />
        </>
      )}
    </div>
  )
}

export default NetworkBenchmarkPage
