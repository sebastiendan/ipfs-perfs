import { Module } from '@nestjs/common'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'

import { ClientsBenchmarkModule } from './clients-benchmark/clients-benchmark.module'
import { NetworkBenchmarkModule } from './network-benchmark/network-benchmark.module'

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'frontend'),
    }),
    ClientsBenchmarkModule,
    NetworkBenchmarkModule,
  ],
})
export class AppModule {}
