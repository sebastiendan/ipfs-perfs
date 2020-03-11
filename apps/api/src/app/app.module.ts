import { Module } from '@nestjs/common'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'

import { ClientsBenchmarkModule } from './clients-benchmark/clients-benchmark.module'
import { LoadTestingModule } from './load-testing/load-testing.module'

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'frontend'),
    }),
    ClientsBenchmarkModule,
    LoadTestingModule,
  ],
})
export class AppModule {}
