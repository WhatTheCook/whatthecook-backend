-- CreateTable
CREATE TABLE "Device" (
    "id" INT8 NOT NULL DEFAULT unique_rowid(),
    "interval" INTERVAL NOT NULL,

    CONSTRAINT "Device_pkey" PRIMARY KEY ("id")
);
