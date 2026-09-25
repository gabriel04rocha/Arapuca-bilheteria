export async function userRoutes(fastify) {
  fastify.get("/users", async () => {
    const users = await fastify.prisma.user.findMany();

    return users;
  });

  fastify.post("/users", async (request) => {
  const body = request.body as {
    name: string;
    email: string;
  };

  const user = await fastify.prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
    },
  });

  return user;
});
}