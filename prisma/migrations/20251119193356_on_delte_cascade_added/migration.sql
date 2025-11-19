-- DropForeignKey
ALTER TABLE "ClickEvent" DROP CONSTRAINT "ClickEvent_linkCode_fkey";

-- AddForeignKey
ALTER TABLE "ClickEvent" ADD CONSTRAINT "ClickEvent_linkCode_fkey" FOREIGN KEY ("linkCode") REFERENCES "Link"("code") ON DELETE CASCADE ON UPDATE CASCADE;
