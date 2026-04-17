import type { Schema, Struct } from '@strapi/strapi';

export interface BannerHeroBanner extends Struct.ComponentSchema {
  collectionName: 'components_banner_hero_banners';
  info: {
    displayName: 'Hero Banner';
    icon: 'monitor';
  };
  attributes: {
    HeroBanner: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    HeroBannerButtonLabel: Schema.Attribute.String;
    HeroBannerDescription: Schema.Attribute.String;
    HeroBannerTitle: Schema.Attribute.String;
    Links: Schema.Attribute.Component<'menus.sublinks', true>;
  };
}

export interface CardWithTextCardwithtext extends Struct.ComponentSchema {
  collectionName: 'components_card_with_text_cardwithtexts';
  info: {
    displayName: 'Cardwithtext';
  };
  attributes: {
    CardButtonLabel: Schema.Attribute.String;
    CardButtonLink: Schema.Attribute.String;
    CardDescription: Schema.Attribute.String;
    Cardtitle: Schema.Attribute.String;
  };
}

export interface CardwithlinkCardwithlink extends Struct.ComponentSchema {
  collectionName: 'components_cardwithlink_cardwithlinks';
  info: {
    displayName: 'Cardswithlink';
  };
  attributes: {
    Description: Schema.Attribute.String;
    Heading: Schema.Attribute.String;
    Link: Schema.Attribute.String;
  };
}

export interface CardwithlinkClassicCardWithImage
  extends Struct.ComponentSchema {
  collectionName: 'components_cardwithlink_classic_card_with_images';
  info: {
    displayName: 'ClassicCardWithImage';
  };
  attributes: {
    ButtonLabel: Schema.Attribute.String;
    ButtonLink: Schema.Attribute.Relation<
      'oneToOne',
      'api::top-content.top-content'
    >;
    Description: Schema.Attribute.Blocks;
    Image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    Title: Schema.Attribute.String;
  };
}

export interface EventSectionEventSection extends Struct.ComponentSchema {
  collectionName: 'components_event_section_event_sections';
  info: {
    displayName: 'EventSection';
  };
  attributes: {
    Eventinformation: Schema.Attribute.Component<
      'cardwithlink.classic-card-with-image',
      false
    >;
    SectionTitle: Schema.Attribute.String;
  };
}

export interface EventSectionFeaturedEvents extends Struct.ComponentSchema {
  collectionName: 'components_event_section_featured_events_s';
  info: {
    displayName: 'FeaturedEvents ';
  };
  attributes: {
    EventHeading: Schema.Attribute.String;
    UpcomingFeaturedEvents: Schema.Attribute.Component<
      'event-section.upcoming-events',
      true
    >;
  };
}

export interface EventSectionUpcomingEvents extends Struct.ComponentSchema {
  collectionName: 'components_event_section_upcoming_events';
  info: {
    displayName: 'UpcomingEvents';
  };
  attributes: {
    Date: Schema.Attribute.Integer;
    Description: Schema.Attribute.Blocks;
    Month: Schema.Attribute.String;
  };
}

export interface ImageImage extends Struct.ComponentSchema {
  collectionName: 'components_image_images';
  info: {
    displayName: 'Image';
  };
  attributes: {
    Image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
  };
}

export interface MenusCommunication extends Struct.ComponentSchema {
  collectionName: 'components_menus_communications';
  info: {
    displayName: 'Communication';
  };
  attributes: {
    Description: Schema.Attribute.Text;
    IconImage: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    Label: Schema.Attribute.String;
  };
}

export interface MenusContactInfo extends Struct.ComponentSchema {
  collectionName: 'components_menus_contact_infos';
  info: {
    displayName: 'ContactInfo';
  };
  attributes: {};
}

export interface MenusLegalInfo extends Struct.ComponentSchema {
  collectionName: 'components_menus_legal_infos';
  info: {
    displayName: 'LegalInfo';
  };
  attributes: {
    Label: Schema.Attribute.String;
    LabelLink: Schema.Attribute.String;
  };
}

export interface MenusMenuLinks extends Struct.ComponentSchema {
  collectionName: 'components_menus_menu_links';
  info: {
    displayName: 'MenuLinks';
    icon: 'link';
  };
  attributes: {
    LinkTitle: Schema.Attribute.String;
    LinkURL: Schema.Attribute.String;
    Sublinks: Schema.Attribute.Component<'menus.sublinks', true>;
  };
}

export interface MenusSublinks extends Struct.ComponentSchema {
  collectionName: 'components_menus_sublinks';
  info: {
    displayName: 'Sublinks';
  };
  attributes: {
    LinkTitle: Schema.Attribute.String;
    LinkURL: Schema.Attribute.String;
  };
}

export interface MenusWeChat extends Struct.ComponentSchema {
  collectionName: 'components_menus_we_chats';
  info: {
    displayName: 'WeChat';
  };
  attributes: {
    Image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    Title: Schema.Attribute.String;
  };
}

export interface SecondfoldFourthFold extends Struct.ComponentSchema {
  collectionName: 'components_secondfold_fourth_folds';
  info: {
    displayName: 'FourthFold';
  };
  attributes: {
    AllArticlesLink: Schema.Attribute.String;
    FeaturedDescription: Schema.Attribute.Blocks;
    FeaturedImage: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    FeaturedTitle: Schema.Attribute.String;
    NewsLetterButtonLink: Schema.Attribute.String;
    NewsLetterButtonText: Schema.Attribute.String;
    SubTitle: Schema.Attribute.Text;
    Title: Schema.Attribute.String;
  };
}

export interface SecondfoldSecondFold extends Struct.ComponentSchema {
  collectionName: 'components_secondfold_second_folds';
  info: {
    displayName: 'SecondFold';
  };
  attributes: {
    FirstCard: Schema.Attribute.Component<'card-with-text.cardwithtext', false>;
    SecondCard: Schema.Attribute.Component<'image.image', false>;
    SectionTitle: Schema.Attribute.String;
    ThirdCards: Schema.Attribute.Component<'cardwithlink.cardwithlink', true>;
  };
}

export interface SecondfoldThirdFold extends Struct.ComponentSchema {
  collectionName: 'components_secondfold_third_folds';
  info: {
    displayName: 'ThirdFold';
  };
  attributes: {
    Cards: Schema.Attribute.Component<'cardwithlink.cardwithlink', true>;
    Description: Schema.Attribute.Blocks;
    Heading: Schema.Attribute.String;
    Image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
  };
}

export interface SectionsSectionOne extends Struct.ComponentSchema {
  collectionName: 'components_sections_section_ones';
  info: {
    displayName: 'SectionOne';
  };
  attributes: {
    Description: Schema.Attribute.Blocks;
    Heading: Schema.Attribute.String;
    Image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    ImagePostion: Schema.Attribute.Enumeration<['None', 'Left', 'Right']>;
  };
}

export interface SeoSeo extends Struct.ComponentSchema {
  collectionName: 'components_seo_seos';
  info: {
    displayName: 'SEO';
    icon: 'search';
  };
  attributes: {
    Keywords: Schema.Attribute.String;
    MetaDescription: Schema.Attribute.Text;
    MetaTitle: Schema.Attribute.String;
  };
}

export interface SocialMediaSocialMedia extends Struct.ComponentSchema {
  collectionName: 'components_social_media_social_medias';
  info: {
    displayName: 'Social Media';
  };
  attributes: {
    PlatformLogo: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    PlatformName: Schema.Attribute.String;
    PlatformNameLink: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'banner.hero-banner': BannerHeroBanner;
      'card-with-text.cardwithtext': CardWithTextCardwithtext;
      'cardwithlink.cardwithlink': CardwithlinkCardwithlink;
      'cardwithlink.classic-card-with-image': CardwithlinkClassicCardWithImage;
      'event-section.event-section': EventSectionEventSection;
      'event-section.featured-events': EventSectionFeaturedEvents;
      'event-section.upcoming-events': EventSectionUpcomingEvents;
      'image.image': ImageImage;
      'menus.communication': MenusCommunication;
      'menus.contact-info': MenusContactInfo;
      'menus.legal-info': MenusLegalInfo;
      'menus.menu-links': MenusMenuLinks;
      'menus.sublinks': MenusSublinks;
      'menus.we-chat': MenusWeChat;
      'secondfold.fourth-fold': SecondfoldFourthFold;
      'secondfold.second-fold': SecondfoldSecondFold;
      'secondfold.third-fold': SecondfoldThirdFold;
      'sections.section-one': SectionsSectionOne;
      'seo.seo': SeoSeo;
      'social-media.social-media': SocialMediaSocialMedia;
    }
  }
}
