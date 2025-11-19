-- CreateTable
CREATE TABLE "Link" (
    "code" VARCHAR(8) NOT NULL,
    "target_url" VARCHAR(1024) NOT NULL,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_clicked_at" TIMESTAMP(3),

    CONSTRAINT "Link_pkey" PRIMARY KEY ("code")
);

-- CreateIndex
CREATE INDEX "Link_created_at_idx" ON "Link"("created_at" DESC);
