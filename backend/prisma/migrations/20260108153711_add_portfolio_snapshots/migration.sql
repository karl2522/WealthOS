-- CreateTable
CREATE TABLE "portfolio_snapshots" (
    "id" TEXT NOT NULL,
    "portfolioId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "totalValue" DECIMAL(18,2) NOT NULL,
    "totalInvested" DECIMAL(18,2) NOT NULL,
    "totalPL" DECIMAL(18,2) NOT NULL,
    "returnPct" DECIMAL(10,4) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "portfolio_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "portfolio_snapshots_portfolioId_idx" ON "portfolio_snapshots"("portfolioId");

-- CreateIndex
CREATE UNIQUE INDEX "portfolio_snapshots_portfolioId_date_key" ON "portfolio_snapshots"("portfolioId", "date");

-- AddForeignKey
ALTER TABLE "portfolio_snapshots" ADD CONSTRAINT "portfolio_snapshots_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "portfolios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
