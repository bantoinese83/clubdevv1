import { notFound } from "next/navigation"
          import { PrismaClient } from "@prisma/client"
          import { CodeSnippet } from "@/app/components/CodeSnippet"
          import { SEO } from "@/app/components/SEO"
          import { PersonStructuredData } from "@/app/components/StructuredData"
          import { EditProfileButton } from "@/app/components/EditProfileButton"
          import { Badge } from "@/app/components/Badge"
          import { getServerSession } from "next-auth/next"
          import { authOptions } from "@/app/auth"
          import Image from "next/image"

          const prisma = new PrismaClient()

          async function getUser(username: string) {
            const user = await prisma.user.findUnique({
              where: { name: username },
              include: {
                snippets: {
                  take: 5,
                  orderBy: { createdAt: "desc" },
                  include: {
                    likes: true,
                  },
                },
                badges: true,
                followers: {
                  select: { id: true, name: true, image: true },
                },
                following: {
                  select: { id: true, name: true, image: true },
                },
              },
            })

            if (!user) {
              return null
            }

            return {
              ...user,
              snippets: user.snippets.map((snippet) => ({
                ...snippet,
                author_name: user.name,
                likes: snippet.likes.length,
              })),
            }
          }

          export default async function ProfilePage({ params }: { params: { username: string } }) {
            const user = await getUser(params.username)
            const session = await getServerSession(authOptions)

            if (!user) {
              notFound()
            }

            const isOwnProfile = session?.user?.name === user.name

            return (
              <>
                <SEO
                  title={`${user.name}&apos;s Profile`}
                  description={`Check out ${user.name}&apos;s code snippets and achievements on ClubDev`}
                  type="profile"
                />
                <PersonStructuredData
                  name={user.name}
                  description={`${user.name}&apos;s profile on ClubDev`}
                  image={user.image || "https://clubdev.com/default-profile-image.jpg"}
                  url={`https://clubdev.com/profile/${user.name}`}
                />
                <div className="max-w-4xl mx-auto">
                  <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h1 className="text-3xl font-bold">{user.name}&apos;s Profile</h1>
                      {isOwnProfile && <EditProfileButton userId={user.id} />}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-600 dark:text-gray-300">Email: {user.email}</p>
                        <p className="text-gray-600 dark:text-gray-300">Location: {user.location || "Not specified"}</p>
                        <p className="text-gray-600 dark:text-gray-300">Website: {user.website || "Not specified"}</p>
                        <p className="text-gray-600 dark:text-gray-300">GitHub: {user.githubProfile || "Not specified"}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-300">Bio: {user.bio || "No bio provided"}</p>
                        <p className="text-gray-600 dark:text-gray-300">
                          Skills: {user.skills?.join(", ") || "No skills specified"}
                        </p>
                        <p className="text-gray-600 dark:text-gray-300">Points: {user.points}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h2 className="text-xl font-semibold mb-2">Badges</h2>
                      <div className="flex flex-wrap gap-2">
                        {user.badges.map((badge) => (
                          <Badge key={badge.id} badge={badge} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
                    <h2 className="text-2xl font-semibold mb-4">Recent Snippets</h2>
                    <div className="grid gap-6 md:grid-cols-2">
                      {user.snippets.map((snippet) => (
                        <CodeSnippet key={snippet.id} snippet={snippet} />
                      ))}
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
                    <h2 className="text-2xl font-semibold mb-4">Network</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Followers ({user.followers.length})</h3>
                        <div className="flex flex-wrap gap-2">
                          {user.followers.map((follower) => (
                            <div key={follower.id} className="flex items-center space-x-2">
                              <Image
                                src={follower.image || "/placeholder.svg"}
                                alt={follower.name}
                                width={32}
                                height={32}
                                className="w-8 h-8 rounded-full"
                              />
                              <span>{follower.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Following ({user.following.length})</h3>
                        <div className="flex flex-wrap gap-2">
                          {user.following.map((followed) => (
                            <div key={followed.id} className="flex items-center space-x-2">
                              <Image
                                src={followed.image || "/placeholder.svg"}
                                alt={followed.name}
                                width={32}
                                height={32}
                                className="w-8 h-8 rounded-full"
                              />
                              <span>{followed.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )
          }