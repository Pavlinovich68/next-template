-- CreateTable
CREATE TABLE "division" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(200),
    "parent_id" INTEGER,

    CONSTRAINT "division_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(25) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tokens" (
    "id" SERIAL NOT NULL,
    "refresh_token" VARCHAR(500) NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "first_name" VARCHAR(30),
    "last_name" VARCHAR(30),
    "patronymic" VARCHAR(30),
    "begin_date" TIMESTAMP(6) NOT NULL,
    "end_date" TIMESTAMP(6),
    "password" VARCHAR(255),
    "restore_link" UUID,
    "restore_time" TIMESTAMP(6),
    "division_id" INTEGER NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_rolesTousers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "division_u_ind" ON "division"("name");

-- CreateIndex
CREATE UNIQUE INDEX "roles_names_u_ind" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_u_ind" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_rolesTousers_AB_unique" ON "_rolesTousers"("A", "B");

-- CreateIndex
CREATE INDEX "_rolesTousers_B_index" ON "_rolesTousers"("B");

-- AddForeignKey
ALTER TABLE "division" ADD CONSTRAINT "division_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "division"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tokens" ADD CONSTRAINT "tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_division_fk" FOREIGN KEY ("division_id") REFERENCES "division"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "_rolesTousers" ADD CONSTRAINT "_rolesTousers_A_fkey" FOREIGN KEY ("A") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_rolesTousers" ADD CONSTRAINT "_rolesTousers_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
