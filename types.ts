export type Authorization = {
	access_token	: string
	token_type	: "Bearer"
	expires_in	: number
	refresh_token	: string
	scope		: string
}

export type CommandRegistration = {
	name		: string
	description	: string
	type		: CommandType
	default_permission: boolean
}

export type Command = {
	choices?	: Array<string>		// CUSTOM: array of possible input choices a user could make when using this command
	description	: string
	handler		: (interaction: Interaction) => InteractionResponseData | Promise<InteractionResponseData>
	name		: string
	options?	: Array<CommandOption>
	type?		: CommandType
}

export type InteractionHandler = (interaction: Interaction) => InteractionResponseData | Promise<InteractionResponseData>

export enum CommandType {
	ChatInput	= 1,			// a text-based command that shows up when a user types / in chat
	User		= 2,			// a UI-based command that shows up when you right click or tap on a user
	Message		= 3			// a UI-based command that shows up when you right click or tap on a message
}

export type CommandOption = {
	channel_types?	: Array<number>		// if the option is a channel type, the channels shown will be restricted to these types
	choices?	: Array<Choice>		// choices for for the user to pick from, max 25
	description	: string		// 1-100 character description of the option
	required?	: boolean		// if the parameter is required or optional, false by default
	name		: string		// 1-32 character name of the option
	type		: OptionType
	options?	: Array<CommandOption>	// if the option is a subcommand or subcommand group type, this nested options will be the parameters
}

export enum OptionType {
	Subommand	= 1,
	SubcommandGroup	= 2,
	String		= 3,
	Integer		= 4,			// Any integer between -2^53 and 2^53
	Boolean		= 5,
	User		= 6,
	Channel		= 7,			// Includes all channel types + categories
	Role		= 8,
	Mentionable	= 9,			// Includes users and roles
	Double		= 10			// Any double between -2^53 and 2^53
}

export type Choice = {
	name		: string		// 1-100 character choice name
	value		: string | number	// value of the choice, up to 100 characters if string	
}

export type Interaction = {
	application_id	: string		// the id of the application this interaction is for
	channel_id?	: string		// present when a command is used in a guild
	data?		: InteractionData
	guild_id?	: string		// present when a command is used in a guild
	id		: string		// unique interaction id
	input?		: string		// CUSTOM: input the user provided when using a command
	member?		: Member		// present when a command is used in a guild
	message?	: Message		// present when a button on a response is used
	token		: string		// a continuation token for responding to the interaction
	type		: InteractionType
	user?		: User			// present when a command is used in DMs
	userID?		: string		// CUSTOM: the unique id of the user who started this interaction
	version		: number		// always 1
}

export enum InteractionType {
	Ping			= 1,
	ApplicationCommand	= 2,
	MessageComponent	= 3
}

export type InteractionData = {
	component_type?	: ComponentType
	custom_id?	: string		// the custom id of the component
	id		: string		// the id of the invoked command
	name		: string		// the name of the invoked command
	options?	: Array<InteractionOption>// the params + values from the user
	resolved?	: null			// EDIT THIS converted users + roles + channels
	target_id?	: null			// EDIT THIS
	type		: CommandType		// the type of the invoked command
	values?		: Array<string>		// the values the user selected
}

export type InteractionOption = {
	name		: string
	type		: OptionType
	value		: string
}

export type Member = {
	avatar		: string | null		// the member's guild avatar hash
	deaf?		: boolean		// whether the user is deafened in voice channels
	is_pending	: boolean,
	joined_at	: string		// when the user joined the guild
	mute?		: boolean		// whether the user is muted in voice channels
	nick		: string | null		// this users guild nickname
	pending		: boolean		// whether the user has not yet passed the guild's Membership Screening requirements
	permissions	: string		// total permissions of the member in the channel, including overwrites, returned when in the interaction object
	premium_since	: string | null 	// when the user started boosting the guild
	roles		: Array<string>		// role object ids
	user?		: User			// the user this guild member represents
}

export type User = {
	accent_color?	: number		// the user's banner color encoded as an integer representation of hexadecimal color code
	avatar		: string | null		// the user's avatar hash
	banner?		: string		// the user's banner hash
	bot		: boolean		// whether the user belongs to an OAuth2 application
	discriminator	: string		// the user's 4-digit discord-tag
	email?		: string		// the user's email
	flags?		: number		// the flags on a user's account
	id		: string		// the user's unique id
	locale?		: string		// the user's chosen language option
	mfa_enabled?	: boolean		// whether the user has two factor enabled on their account
	premium_type?	: NitroType		// the type of Nitro subscription on a user's account
	public_flags	: number		// the public flags on a user's account
	system?		: boolean		// whether the user is an Official Discord System user (part of the urgent message system)
	username	: string		// the user's username, not unique across the platform
	verified?	: boolean		// whether the email on this account has been verified
}

export enum NitroType { None, Classic,	Nitro }

export type Message = {
	// activity?: MessageActivity		// sent with Rich Presence-related chat embeds
	// application?: Application		// sent with Rich Presence-related chat embeds
	ApplicationID?		: string	// the id of the interaction's application, if the message is a response to an Interaction
	// attachments: Array<Attachment>	// any attached files
	author			: User		// the author of this message
	channel_id		: string 	// id of the channel the message was sent in
	// compoonents?: Array<MessageComponent>// sent if the message contains components like buttons, action rows, or other interactive components
	content			: string	// contents of the message
	edited_timestamp?	: string | null	// when this message was edited (or null if never)
	embeds			: Array<Embed>	// any embedded content
	flags?			: number	// message flags combined as a bitfield
	guild_id?		: string	// id of the guild the message was sent in
	id			: string	// id of the message
	// interaction?: MessageInteraction 	// sent if the message is a response to an Interaction
	member?			: Member	// member properties for this message's author
	// mention_channels?: Array<ChannelMention>// channels specifically mentioned in this message
	mention_everyone	: boolean	// whether this message mentions everyone
	// mention_roles: Array<Role>		// roles specifically mentioned in this message
	mentions		: Array<User>	// users specifically mentioned in the message
	// message_reference?: MessageReference // data showing the source of a crosspost, channel follow add, pin, or reply message
	nonce?			: string | number// used for validating a message was sent
	pinned			: boolean	// whether this message is pinned
	// reacions?: Array<Reaction>		// reactions to the message
	referenced_message?	: Message	// the message associated with the message_reference
	// sticker_items?: Array<MessageSticker>// sent if the message contains stickers
	// thread?: Channel			// the thread that was started from this message, includes thread member object
	timestamp		: string	// when this message was sent, "2021-05-27T21:29:27.956000+00:00"
	tts			: boolean	// whether this was a TTS message
	type			: number	// one of 23 types of messages
	webhook_id?		: string	// the webhook's id, if the message is generated by one
}

export type InteractionResponse = {
	type	: InteractionResponseType
	data?	: InteractionResponseData 
}

export enum InteractionResponseType {
	Pong		= 1,	// ACK a Ping
	ImmediateReply	= 4,	// respond to an interaction with a message
	DeferredReply	= 5,	// ACK an interaction and edit a response later, the user sees a loading state
	ImmediateUpdate	= 6,	// for components, ACK an interaction and edit the original message later, the user does not see a loading state
	DeferredUpdate	= 7	// for components, edit the message the component was attached to
}

export type InteractionResponseData = {
	allowed_mentions?	: AllowedMentions
	attachment?		: Blob			// not a part of Discord API, converted to formdata
	components?		: Array<Component>
	content?		: string		// simple text resoonse
	embeds?			: Array<Embed>		// up to 10 embeds
	flags?			: number		// ???
	tts?			: boolean		// text to speech
}

export type Component = {
	components?	: Array<Component>	// a list of child components
	custom_id?	: string		// a developer-defined identifier for the component, max 100 characters
	disabled?	: boolean		// whether the component is disabled, default false
	emoji?		: null			// EDIT THIS name, id, and animated
	label?		: string		// text that appears on the button, max 80 characters
	max_values?	: number 		// the maximum number of items that can be chosen; default 1, max 25
	min_values?	: number		// the minimum number of items that must be chosen; default 1, min 0, max 25
	options?	: Array<SelectOption>	// the choices in the select menu, max 25
	placeholder?	: string		// custom placeholder text if nothing is selected, max 100 characters
	style?		: ButtonStyle
	type		: ComponentType
	url?		: string		// a url for link-style buttons
}

export enum ComponentType {
	ActionRow	= 1,		// a container for other components
	Button		= 2,
	SelectMenu	= 3		// a menu for picking from choices
}

export enum ButtonStyle {
	Primary		= 1,		// blurple, custom_id required
	Secondary	= 2,		// grey, custom_id required
	Success		= 3,		// green, custom_id required
	Danger		= 4,		// red, custom_id required
	Link		= 5		// grey, url required
}

export type SelectOption = {
	default?	: boolean	// will render this option as selected by default
	description?	: string	// an additional description of the option, max 100 characters
	emoji?		: null		// EDIT THIS id, name, and animated
	label		: string	// the user-facing name of the option, max 100 characters
	value		: string	// the dev-defined value of the option, max 100 characters
}

export type AllowedMentions = {
	parse		: Array<MentionTypes>	// allowed mention types to parse from the content
	replied_user	: boolean		// For replies, whether to mention the author of the message being replied to, false by default
	roles		: Array<string>		// role ids to ping, max 100
	users		: Array<string>		// user ids to ping, max 100
}

export type MentionTypes = 
	| "users"
	| "roles"
	| "everyone" 		// @everyone and @here mentions

export type Embed = {
	color?		: number
	description?	: string
	timestamp?	: string 	// "2021-05-27T21:29:27.956000+00:00"
	title?		: string		// title of embed
	type?		: EmbedType	// always "rich" for webhook embeds
	url?		: string
	author?		: EmbedAuthor
	fields?		: Array<EmbedField>
	footer?		: EmbedFooter
	image?		: EmbedImage
	provider?	: EmbedProvider
	thumbnail?	: EmbedThumbnail
	video?		: EmbedVideo
}

export type EmbedType =
	| "article"
	| "gifv"		// animated gif image embed rendered as a video embed
	| "image"
	| "link"
	| "rich"		// generic embed rendered from embed attributes
	| "video"

export type EmbedAuthor = {
	name		: string
	url?		: string
	icon_url?	: string 
	proxy_icon_url?	: string
}

export type EmbedField = {
	name		: string
	value		: string
	inline?		: boolean
}

export type EmbedFooter = {
	text		: string
	icon_url?	: string
	proxy_icon_url?	: string
}
	
export type EmbedImage = {
	url		: string
	proxy_url?	: string
	height?		: string
	width?		: number
}

export type EmbedProvider = {
	name?		: string
	url?		: string
}

export type EmbedThumbnail = {
	url		: string
	proxy_url?	: string
	height?		: string
	width?		: number
}

export type EmbedVideo = {
	url?		: string
	proxy_url?	: string
	height?		: string
	width?		: number
}
