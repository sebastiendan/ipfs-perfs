import axios from 'axios'

export function assignCancelToken(cancelRequest) {
  return new axios.CancelToken(c => {
    cancelRequest = c
  })
}

export function cancelEffectCleaning(cancelRequest, message?: string) {
  return function() {
    if (cancelRequest) {
      cancelRequest(message || 'Request cancelled by the user.')
    }
  }
}
